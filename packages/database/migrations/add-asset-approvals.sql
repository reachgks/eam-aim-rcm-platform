-- Add PENDING_APPROVAL to asset_status enum (already done via ALTER TYPE)
-- Create asset_approval_status enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'asset_approval_status') THEN
    CREATE TYPE asset_approval_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
  END IF;
END$$;

-- Create asset_approvals table
CREATE TABLE IF NOT EXISTS asset_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  approval_step INTEGER NOT NULL,
  approver_role VARCHAR(100) NOT NULL,
  approver_id UUID,
  status asset_approval_status NOT NULL DEFAULT 'PENDING',
  comments TEXT,
  decided_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_asset_approvals_tenant_asset ON asset_approvals(tenant_id, asset_id);
CREATE INDEX IF NOT EXISTS idx_asset_approvals_approver ON asset_approvals(tenant_id, approver_id);
CREATE INDEX IF NOT EXISTS idx_asset_approvals_status ON asset_approvals(tenant_id, status);
