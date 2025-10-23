-- Migration script to create initial database schema

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT,
  role TEXT NOT NULL CHECK (role IN ('ADMIN', 'RH', 'FUNCIONARIO', 'GESTOR', 'JURIDICO')),
  name TEXT,
  profiles JSONB DEFAULT '[]'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  name TEXT NOT NULL,
  email TEXT,
  cpf CHAR(11) NOT NULL UNIQUE,
  position TEXT,
  salary NUMERIC(12, 2),
  admission_date DATE,
  corporate_email TEXT,
  status TEXT NOT NULL DEFAULT 'APROVADO',
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE contracts (
  id SERIAL PRIMARY KEY,
  employee_id INT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  storage_url TEXT,
  file_name TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  employee_id INT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('CONTRATO', 'ADITIVO', 'RG', 'CPF', 'CTPS', 'ENDERECO', 'EXAME', 'OUTRO')),
  status TEXT NOT NULL DEFAULT 'PENDENTE',
  notes TEXT,
  expiry_date DATE,
  current_version INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE document_versions (
  id SERIAL PRIMARY KEY,
  document_id INT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  v INT NOT NULL,
  storage_url TEXT,
  filename TEXT,
  size_bytes BIGINT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  uploaded_by TEXT,
  UNIQUE (document_id, v)
);

CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL,
  status TEXT NOT NULL,
  collaborator_id INT REFERENCES employees(id) ON DELETE SET NULL,
  payload JSONB NOT NULL,
  protocolo TEXT,
  recibo TEXT,
  signature JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE batches (
  id SERIAL PRIMARY KEY,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE batch_events (
  batch_id INT NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  event_id INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  PRIMARY KEY (batch_id, event_id)
);

CREATE TABLE event_errors (
  id SERIAL PRIMARY KEY,
  event_id INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  code TEXT,
  message TEXT NOT NULL,
  occurred_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_employees_cpf ON employees(cpf);
CREATE INDEX idx_events_type_status ON events(type, status);
CREATE INDEX idx_documents_employee ON documents(employee_id);
CREATE INDEX idx_doc_versions_doc ON document_versions(document_id);