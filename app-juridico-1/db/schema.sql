create table users (
  id serial primary key,
  username text not null unique,
  password_hash text,
  role text not null check (role in ('ADMIN','RH','FUNCIONARIO','GESTOR','JURIDICO')),
  name text,
  profiles jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

create table employees (
  id serial primary key,
  user_id int references users(id),
  name text not null,
  email text,
  cpf char(11) not null unique,
  position text,
  salary numeric(12,2),
  admission_date date,
  corporate_email text,
  status text not null default 'APROVADO',
  approved_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table contracts (
  id serial primary key,
  employee_id int not null references employees(id) on delete cascade,
  storage_url text,
  file_name text,
  uploaded_at timestamptz default now()
);

create table documents (
  id serial primary key,
  employee_id int not null references employees(id) on delete cascade,
  type text not null check (type in ('CONTRATO','ADITIVO','RG','CPF','CTPS','ENDERECO','EXAME','OUTRO')),
  status text not null default 'PENDENTE',
  notes text,
  expiry_date date,
  current_version int default 1,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table document_versions (
  id serial primary key,
  document_id int not null references documents(id) on delete cascade,
  v int not null,
  storage_url text,
  filename text,
  size_bytes bigint,
  uploaded_at timestamptz default now(),
  uploaded_by text,
  unique (document_id, v)
);

create table events (
  id serial primary key,
  type text not null,
  status text not null,
  collaborator_id int references employees(id) on delete set null,
  payload jsonb not null,
  protocolo text,
  recibo text,
  signature jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table batches (
  id serial primary key,
  status text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table batch_events (
  batch_id int not null references batches(id) on delete cascade,
  event_id int not null references events(id) on delete cascade,
  primary key (batch_id, event_id)
);

create table event_errors (
  id serial primary key,
  event_id int not null references events(id) on delete cascade,
  category text not null,
  code text,
  message text not null,
  occurred_at timestamptz default now()
);

create index idx_employees_cpf on employees(cpf);
create index idx_events_type_status on events(type, status);
create index idx_documents_employee on documents(employee_id);
create index idx_doc_versions_doc on document_versions(document_id);