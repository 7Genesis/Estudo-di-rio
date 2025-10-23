-- ===== HUB EVOLUTI 360 - SCHEMA SQL =====
-- PostgreSQL 14+

-- USUÁRIOS E PERMISSÕES
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('ADMINISTRADOR', 'RH', 'JURIDICO', 'GESTOR')),
  ativo BOOLEAN DEFAULT TRUE,
  mfa_enabled BOOLEAN DEFAULT FALSE,
  mfa_secret VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_role ON usuarios(role);

-- COLABORADORES
CREATE TABLE colaboradores (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  cpf VARCHAR(11) UNIQUE NOT NULL,
  data_nascimento DATE,
  cargo VARCHAR(255),
  salario DECIMAL(10,2),
  data_admissao DATE NOT NULL,
  data_demissao DATE,
  status VARCHAR(50) DEFAULT 'ATIVO' CHECK (status IN ('ATIVO', 'AFASTADO', 'DESLIGADO')),
  created_at TIMESTAMP DEFAULT NOW(),
  created_by INT REFERENCES usuarios(id),
  updated_at TIMESTAMP DEFAULT NOW(),
  updated_by INT REFERENCES usuarios(id)
);

CREATE INDEX idx_colaboradores_cpf ON colaboradores(cpf);
CREATE INDEX idx_colaboradores_status ON colaboradores(status);
CREATE INDEX idx_colaboradores_data_admissao ON colaboradores(data_admissao);

-- CONTRATOS
CREATE TABLE contratos (
  id SERIAL PRIMARY KEY,
  colaborador_id INT NOT NULL REFERENCES colaboradores(id),
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('ADMISSAO', 'ALTERACAO', 'RESCISAO')),
  arquivo_url TEXT,
  arquivo_base64 TEXT,
  arquivo_nome VARCHAR(255),
  assinado BOOLEAN DEFAULT FALSE,
  assinatura_tipo VARCHAR(50),
  assinatura_timestamp TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  created_by INT REFERENCES usuarios(id)
);

CREATE INDEX idx_contratos_colaborador ON contratos(colaborador_id);

-- EVENTOS ESOCIAL
CREATE TABLE eventos (
  id SERIAL PRIMARY KEY,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('S-1000', 'S-1005', 'S-1010', 'S-2200', 'S-2205', 'S-2206', 'S-2230', 'S-2240', 'S-2299', 'S-1200', 'S-1210')),
  colaborador_id INT REFERENCES colaboradores(id),
  status VARCHAR(50) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'VALIDADO', 'ASSINADO', 'ENVIADO', 'PROCESSADO', 'ERRO')),
  payload JSONB NOT NULL,
  xml TEXT,
  xml_assinado TEXT,
  validacoes JSONB DEFAULT '[]',
  erros JSONB DEFAULT '[]',
  protocolo VARCHAR(255),
  recibo VARCHAR(255),
  retorno_gov JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  created_by INT REFERENCES usuarios(id),
  validated_at TIMESTAMP,
  validated_by INT REFERENCES usuarios(id),
  signed_at TIMESTAMP,
  signed_by INT REFERENCES usuarios(id),
  transmitted_at TIMESTAMP,
  transmitted_by INT REFERENCES usuarios(id),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_eventos_tipo ON eventos(tipo);
CREATE INDEX idx_eventos_status ON eventos(status);
CREATE INDEX idx_eventos_colaborador ON eventos(colaborador_id);
CREATE INDEX idx_eventos_protocolo ON eventos(protocolo);

-- LOTES
CREATE TABLE lotes (
  id SERIAL PRIMARY KEY,
  descricao VARCHAR(255),
  status VARCHAR(50) DEFAULT 'PROCESSANDO' CHECK (status IN ('PROCESSANDO', 'CONCLUIDO', 'ERRO_PARCIAL', 'ERRO_TOTAL')),
  total_eventos INT DEFAULT 0,
  eventos_processados INT DEFAULT 0,
  eventos_erro INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  created_by INT REFERENCES usuarios(id),
  finished_at TIMESTAMP
);

CREATE TABLE lotes_eventos (
  lote_id INT NOT NULL REFERENCES lotes(id) ON DELETE CASCADE,
  evento_id INT NOT NULL REFERENCES eventos(id) ON DELETE CASCADE,
  PRIMARY KEY (lote_id, evento_id)
);

-- CERTIFICADOS
CREATE TABLE certificados (
  id SERIAL PRIMARY KEY,
  tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('A1', 'A3')),
  arquivo_path TEXT NOT NULL,
  senha_encrypted TEXT NOT NULL,
  validade DATE NOT NULL,
  cnpj VARCHAR(14),
  ativo BOOLEAN DEFAULT TRUE,
  uploaded_at TIMESTAMP DEFAULT NOW(),
  uploaded_by INT REFERENCES usuarios(id),
  expires_alert_sent BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_certificados_validade ON certificados(validade);
CREATE INDEX idx_certificados_ativo ON certificados(ativo);

-- LOGS DE AUDITORIA (LGPD)
CREATE TABLE logs_auditoria (
  id SERIAL PRIMARY KEY,
  action VARCHAR(100) NOT NULL,
  user_id INT REFERENCES usuarios(id),
  ip_address INET,
  user_agent TEXT,
  resource_type VARCHAR(50),
  resource_id INT,
  payload JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_logs_action ON logs_auditoria(action);
CREATE INDEX idx_logs_user ON logs_auditoria(user_id);
CREATE INDEX idx_logs_created ON logs_auditoria(created_at);

-- FOLHA DE PAGAMENTO
CREATE TABLE folhas (
  id SERIAL PRIMARY KEY,
  competencia VARCHAR(7) NOT NULL, -- AAAA-MM
  colaborador_id INT NOT NULL REFERENCES colaboradores(id),
  salario_base DECIMAL(10,2),
  total_proventos DECIMAL(10,2),
  total_descontos DECIMAL(10,2),
  liquido DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'PENDENTE' CHECK (status IN ('PENDENTE', 'CALCULADA', 'TRANSMITIDA')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_folhas_competencia ON folhas(competencia);
CREATE INDEX idx_folhas_colaborador ON folhas(colaborador_id);

-- RUBRICAS
CREATE TABLE rubricas (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(20) UNIQUE NOT NULL,
  descricao VARCHAR(255) NOT NULL,
  tipo VARCHAR(20) CHECK (tipo IN ('PROVENTO', 'DESCONTO')),
  natureza VARCHAR(50),
  incidencia_inss BOOLEAN DEFAULT FALSE,
  incidencia_irrf BOOLEAN DEFAULT FALSE,
  incidencia_fgts BOOLEAN DEFAULT FALSE,
  ativo BOOLEAN DEFAULT TRUE
);

-- ITENS DA FOLHA
CREATE TABLE folhas_itens (
  id SERIAL PRIMARY KEY,
  folha_id INT NOT NULL REFERENCES folhas(id) ON DELETE CASCADE,
  rubrica_id INT NOT NULL REFERENCES rubricas(id),
  valor DECIMAL(10,2) NOT NULL,
  quantidade DECIMAL(10,3) DEFAULT 1
);

-- VIEWS ÚTEIS
CREATE VIEW vw_eventos_pendentes AS
SELECT 
  e.id,
  e.tipo,
  e.status,
  c.nome AS colaborador_nome,
  c.cpf,
  EXTRACT(DAY FROM NOW() - e.created_at) AS dias_pendente,
  e.created_at
FROM eventos e
LEFT JOIN colaboradores c ON e.colaborador_id = c.id
WHERE e.status IN ('DRAFT', 'VALIDADO', 'ASSINADO')
ORDER BY e.created_at;

CREATE VIEW vw_dashboard_rh AS
SELECT
  (SELECT COUNT(*) FROM colaboradores WHERE status = 'ATIVO') AS colaboradores_ativos,
  (SELECT COUNT(*) FROM eventos WHERE status IN ('DRAFT', 'VALIDADO', 'ASSINADO')) AS eventos_pendentes,
  (SELECT COUNT(*) FROM eventos WHERE status = 'ERRO') AS eventos_erro,
  (SELECT COUNT(*) FROM eventos WHERE EXTRACT(DAY FROM NOW() - created_at) > 7 AND status != 'ENVIADO') AS prazos_criticos;

-- FUNÇÕES
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_colaboradores_updated
BEFORE UPDATE ON colaboradores
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_eventos_updated
BEFORE UPDATE ON eventos
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- COMENTÁRIOS (DOCUMENTAÇÃO)
COMMENT ON TABLE usuarios IS 'Gestão de usuários do sistema com RBAC';
COMMENT ON TABLE colaboradores IS 'Cadastro de colaboradores (dados pessoais protegidos por LGPD)';
COMMENT ON TABLE eventos IS 'Eventos eSocial com ciclo de vida completo';
COMMENT ON TABLE logs_auditoria IS 'Trilhas de auditoria para conformidade LGPD';
COMMENT ON COLUMN colaboradores.cpf IS 'CPF criptografado em aplicação (AES-256)';
COMMENT ON COLUMN certificados.senha_encrypted IS 'Senha do certificado criptografada com chave mestra';