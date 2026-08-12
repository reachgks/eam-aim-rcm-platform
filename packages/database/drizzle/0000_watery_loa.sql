CREATE TYPE "public"."tenant_plan" AS ENUM('FREE', 'STARTER', 'PROFESSIONAL', 'ENTERPRISE');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('SUPER_ADMIN', 'TENANT_ADMIN', 'MANAGER', 'ENGINEER', 'TECHNICIAN', 'OPERATOR', 'VIEWER');--> statement-breakpoint
CREATE TYPE "public"."permission" AS ENUM('ASSET_CREATE', 'ASSET_READ', 'ASSET_UPDATE', 'ASSET_DELETE', 'ASSET_DECOMMISSION', 'WORK_ORDER_CREATE', 'WORK_ORDER_READ', 'WORK_ORDER_UPDATE', 'WORK_ORDER_APPROVE', 'WORK_ORDER_CLOSE', 'INVENTORY_READ', 'INVENTORY_UPDATE', 'INVENTORY_ADJUST', 'PROCUREMENT_REQUEST', 'PROCUREMENT_APPROVE', 'PROCUREMENT_READ', 'REPORT_VIEW', 'REPORT_CREATE', 'REPORT_EXPORT', 'ADMIN_USERS', 'ADMIN_ROLES', 'ADMIN_SETTINGS', 'ADMIN_BILLING', 'ADMIN_INTEGRATIONS', 'SAFETY_READ', 'SAFETY_CREATE', 'SAFETY_APPROVE', 'FINANCIAL_READ', 'FINANCIAL_APPROVE');--> statement-breakpoint
CREATE TYPE "public"."audit_action" AS ENUM('CREATE', 'UPDATE', 'DELETE', 'ARCHIVE', 'RESTORE', 'LOGIN', 'LOGOUT', 'EXPORT', 'IMPORT', 'APPROVE', 'REJECT', 'STATUS_CHANGE');--> statement-breakpoint
CREATE TYPE "public"."sso_provider_type" AS ENUM('SAML', 'OIDC', 'LDAP');--> statement-breakpoint
CREATE TYPE "public"."mfa_method" AS ENUM('TOTP', 'SMS', 'EMAIL');--> statement-breakpoint
CREATE TYPE "public"."asset_criticality" AS ENUM('A', 'B', 'C', 'D');--> statement-breakpoint
CREATE TYPE "public"."asset_status" AS ENUM('PLANNED', 'ACTIVE', 'INACTIVE', 'DECOMMISSIONED', 'DISPOSED');--> statement-breakpoint
CREATE TYPE "public"."hierarchy_relationship_type" AS ENUM('PHYSICAL', 'FUNCTIONAL', 'LOGICAL');--> statement-breakpoint
CREATE TYPE "public"."location_type" AS ENUM('SITE', 'BUILDING', 'FLOOR', 'ZONE', 'ROOM');--> statement-breakpoint
CREATE TYPE "public"."lifecycle_event_type" AS ENUM('ACQUISITION', 'INSTALLATION', 'COMMISSIONING', 'MAINTENANCE', 'MODIFICATION', 'DECOMMISSION', 'DISPOSAL');--> statement-breakpoint
CREATE TYPE "public"."container_type" AS ENUM('DOCUMENT', 'MODEL', 'DATASET', 'DRAWING');--> statement-breakpoint
CREATE TYPE "public"."cde_state" AS ENUM('WORK_IN_PROGRESS', 'SHARED', 'PUBLISHED', 'ARCHIVED');--> statement-breakpoint
CREATE TYPE "public"."change_type" AS ENUM('MAJOR', 'MINOR', 'PATCH');--> statement-breakpoint
CREATE TYPE "public"."handover_item_status" AS ENUM('PENDING', 'VALIDATED', 'FAILED', 'SKIPPED');--> statement-breakpoint
CREATE TYPE "public"."handover_status" AS ENUM('PREPARING', 'SUBMITTED', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED');--> statement-breakpoint
CREATE TYPE "public"."handover_type" AS ENUM('PIM_TO_AIM', 'PARTIAL', 'STAGED');--> statement-breakpoint
CREATE TYPE "public"."dq_issue_status" AS ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED', 'IGNORED');--> statement-breakpoint
CREATE TYPE "public"."dq_rule_type" AS ENUM('COMPLETENESS', 'ACCURACY', 'CONSISTENCY', 'TIMELINESS', 'UNIQUENESS', 'FORMAT');--> statement-breakpoint
CREATE TYPE "public"."dq_severity" AS ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');--> statement-breakpoint
CREATE TYPE "public"."twin_status" AS ENUM('DISCONNECTED', 'CONNECTED', 'LIVE', 'STALE');--> statement-breakpoint
CREATE TYPE "public"."lifecycle_stage" AS ENUM('BRIEF', 'DESIGN', 'BUILD', 'COMMISSION', 'HANDOVER', 'OPERATE', 'MAINTAIN', 'DECOMMISSION');--> statement-breakpoint
CREATE TYPE "public"."oir_priority" AS ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');--> statement-breakpoint
CREATE TYPE "public"."eir_status" AS ENUM('DRAFT', 'ISSUED', 'IN_PROGRESS', 'DELIVERED', 'ACCEPTED', 'REJECTED');--> statement-breakpoint
CREATE TYPE "public"."exchange_method" AS ENUM('CDE_UPLOAD', 'API', 'FILE_TRANSFER', 'DIRECT_ENTRY');--> statement-breakpoint
CREATE TYPE "public"."idp_deliverable_status" AS ENUM('PENDING', 'IN_PROGRESS', 'DELIVERED', 'ACCEPTED', 'REJECTED', 'OVERDUE');--> statement-breakpoint
CREATE TYPE "public"."idp_status" AS ENUM('DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."idp_type" AS ENUM('MIDP', 'TIDP');--> statement-breakpoint
CREATE TYPE "public"."work_order_priority" AS ENUM('CRITICAL', 'HIGH', 'MEDIUM', 'LOW');--> statement-breakpoint
CREATE TYPE "public"."work_order_status" AS ENUM('DRAFT', 'PLANNED', 'SCHEDULED', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CLOSED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."work_order_type" AS ENUM('PREVENTIVE', 'CORRECTIVE', 'PREDICTIVE', 'EMERGENCY', 'INSPECTION', 'PROJECT');--> statement-breakpoint
CREATE TYPE "public"."approval_status" AS ENUM('PENDING', 'APPROVED', 'REJECTED');--> statement-breakpoint
CREATE TYPE "public"."maintenance_plan_type" AS ENUM('TIME_BASED', 'METER_BASED', 'CONDITION_BASED', 'EVENT_BASED');--> statement-breakpoint
CREATE TYPE "public"."maintenance_task_status" AS ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED');--> statement-breakpoint
CREATE TYPE "public"."maintenance_task_type" AS ENUM('INSPECTION', 'LUBRICATION', 'ADJUSTMENT', 'REPLACEMENT', 'TESTING', 'CLEANING');--> statement-breakpoint
CREATE TYPE "public"."route_execution_status" AS ENUM('IN_PROGRESS', 'COMPLETED', 'INCOMPLETE');--> statement-breakpoint
CREATE TYPE "public"."route_stop_reading_status" AS ENUM('PENDING', 'COMPLETED', 'SKIPPED');--> statement-breakpoint
CREATE TYPE "public"."shutdown_status" AS ENUM('PLANNING', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."shutdown_type" AS ENUM('PLANNED_SHUTDOWN', 'TURNAROUND', 'OUTAGE');--> statement-breakpoint
CREATE TYPE "public"."shutdown_scope_priority" AS ENUM('CRITICAL', 'HIGH', 'MEDIUM', 'LOW');--> statement-breakpoint
CREATE TYPE "public"."shutdown_scope_status" AS ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'DEFERRED');--> statement-breakpoint
CREATE TYPE "public"."shutdown_scope_type" AS ENUM('INSPECTION', 'REPAIR', 'REPLACEMENT', 'MODIFICATION');--> statement-breakpoint
CREATE TYPE "public"."certification_status" AS ENUM('ACTIVE', 'EXPIRED', 'SUSPENDED', 'REVOKED');--> statement-breakpoint
CREATE TYPE "public"."crew_member_role" AS ENUM('LEADER', 'MEMBER');--> statement-breakpoint
CREATE TYPE "public"."labor_booking_status" AS ENUM('PLANNED', 'STARTED', 'COMPLETED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."availability_type" AS ENUM('AVAILABLE', 'LEAVE', 'TRAINING', 'ON_CALL');--> statement-breakpoint
CREATE TYPE "public"."storeroom_type" AS ENUM('GENERAL', 'HAZMAT', 'COLD_STORE', 'OUTDOOR');--> statement-breakpoint
CREATE TYPE "public"."stock_transaction_type" AS ENUM('ISSUE', 'RECEIVE', 'RETURN', 'TRANSFER', 'ADJUST', 'SCRAP');--> statement-breakpoint
CREATE TYPE "public"."cycle_count_status" AS ENUM('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'RECONCILED');--> statement-breakpoint
CREATE TYPE "public"."reorder_rule_type" AS ENUM('MIN_MAX', 'EOQ', 'KANBAN');--> statement-breakpoint
CREATE TYPE "public"."vendor_type" AS ENUM('SUPPLIER', 'MANUFACTURER', 'SERVICE_PROVIDER');--> statement-breakpoint
CREATE TYPE "public"."pr_status" AS ENUM('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'CONVERTED');--> statement-breakpoint
CREATE TYPE "public"."po_status" AS ENUM('DRAFT', 'SUBMITTED', 'CONFIRMED', 'PARTIALLY_RECEIVED', 'RECEIVED', 'CLOSED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."po_line_status" AS ENUM('OPEN', 'PARTIALLY_RECEIVED', 'RECEIVED', 'CLOSED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."invoice_status" AS ENUM('PENDING', 'MATCHED', 'PARTIAL_MATCH', 'DISPUTED', 'PAID');--> statement-breakpoint
CREATE TYPE "public"."warranty_coverage_type" AS ENUM('FULL', 'LIMITED', 'LABOR_ONLY', 'PARTS_ONLY', 'EXTENDED');--> statement-breakpoint
CREATE TYPE "public"."warranty_coverage_status" AS ENUM('ACTIVE', 'EXPIRED', 'VOIDED', 'CLAIMED');--> statement-breakpoint
CREATE TYPE "public"."warranty_claim_status" AS ENUM('SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'PAID');--> statement-breakpoint
CREATE TYPE "public"."sla_metric_name" AS ENUM('RESPONSE_TIME', 'RESOLUTION_TIME', 'UPTIME', 'FIRST_FIX_RATE');--> statement-breakpoint
CREATE TYPE "public"."sla_breach_type" AS ENUM('RESPONSE', 'RESOLUTION', 'UPTIME');--> statement-breakpoint
CREATE TYPE "public"."contract_status" AS ENUM('DRAFT', 'ACTIVE', 'EXPIRED', 'TERMINATED');--> statement-breakpoint
CREATE TYPE "public"."contract_type" AS ENUM('FIXED_PRICE', 'TIME_MATERIAL', 'UNIT_RATE', 'BLANKET');--> statement-breakpoint
CREATE TYPE "public"."contractor_safety_record_type" AS ENUM('INDUCTION', 'INCIDENT', 'VIOLATION', 'DRUG_TEST', 'SAFETY_TRAINING');--> statement-breakpoint
CREATE TYPE "public"."work_permit_status" AS ENUM('REQUESTED', 'ISSUED', 'ACTIVE', 'SUSPENDED', 'CLOSED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."work_permit_type" AS ENUM('HOT_WORK', 'CONFINED_SPACE', 'ELECTRICAL', 'EXCAVATION', 'WORKING_AT_HEIGHT', 'COLD_WORK', 'GENERAL');--> statement-breakpoint
CREATE TYPE "public"."isolation_point_type" AS ENUM('ELECTRICAL', 'MECHANICAL', 'HYDRAULIC', 'PNEUMATIC', 'PROCESS');--> statement-breakpoint
CREATE TYPE "public"."loto_application_status" AS ENUM('APPLIED', 'VERIFIED', 'REMOVED');--> statement-breakpoint
CREATE TYPE "public"."safety_observation_status" AS ENUM('OPEN', 'INVESTIGATING', 'RESOLVED');--> statement-breakpoint
CREATE TYPE "public"."safety_observation_type" AS ENUM('NEAR_MISS', 'UNSAFE_ACT', 'UNSAFE_CONDITION', 'POSITIVE');--> statement-breakpoint
CREATE TYPE "public"."budget_status" AS ENUM('DRAFT', 'APPROVED', 'FROZEN');--> statement-breakpoint
CREATE TYPE "public"."budget_type" AS ENUM('OPEX', 'CAPEX');--> statement-breakpoint
CREATE TYPE "public"."cost_category" AS ENUM('LABOR', 'MATERIAL', 'SERVICE', 'OVERHEAD', 'DEPRECIATION');--> statement-breakpoint
CREATE TYPE "public"."cost_source_type" AS ENUM('WORK_ORDER', 'PURCHASE_ORDER', 'LABOR', 'CONTRACT', 'DEPRECIATION');--> statement-breakpoint
CREATE TYPE "public"."depreciation_method" AS ENUM('STRAIGHT_LINE', 'DECLINING_BALANCE', 'DOUBLE_DECLINING', 'UNITS_OF_PRODUCTION', 'SUM_OF_YEARS_DIGITS');--> statement-breakpoint
CREATE TYPE "public"."depreciation_status" AS ENUM('ACTIVE', 'FULLY_DEPRECIATED', 'SUSPENDED', 'DISPOSED');--> statement-breakpoint
CREATE TYPE "public"."valuation_type" AS ENUM('ACQUISITION', 'REVALUATION', 'IMPAIRMENT', 'WRITE_UP', 'DISPOSAL', 'INSURANCE');--> statement-breakpoint
CREATE TYPE "public"."period_type" AS ENUM('MONTH', 'QUARTER', 'YEAR', 'CUSTOM');--> statement-breakpoint
CREATE TYPE "public"."replacement_analysis_status" AS ENUM('DRAFT', 'REVIEWED', 'APPROVED');--> statement-breakpoint
CREATE TYPE "public"."cost_trend" AS ENUM('INCREASING', 'STABLE', 'DECREASING');--> statement-breakpoint
CREATE TYPE "public"."replacement_recommendation" AS ENUM('MAINTAIN', 'REPLACE', 'REFURBISH', 'MONITOR');--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('PROPOSED', 'APPROVED', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."project_type" AS ENUM('NEW_INSTALL', 'REPLACEMENT', 'UPGRADE', 'EXPANSION');--> statement-breakpoint
CREATE TYPE "public"."phase_status" AS ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD');--> statement-breakpoint
CREATE TYPE "public"."project_task_status" AS ENUM('TODO', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED');--> statement-breakpoint
CREATE TYPE "public"."moc_status" AS ENUM('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'IMPLEMENTED', 'CLOSED');--> statement-breakpoint
CREATE TYPE "public"."moc_type" AS ENUM('EQUIPMENT', 'PROCESS', 'ORGANIZATIONAL', 'TEMPORARY');--> statement-breakpoint
CREATE TYPE "public"."moc_approval_status" AS ENUM('PENDING', 'APPROVED', 'REJECTED', 'DEFERRED');--> statement-breakpoint
CREATE TYPE "public"."sr_priority" AS ENUM('CRITICAL', 'HIGH', 'MEDIUM', 'LOW');--> statement-breakpoint
CREATE TYPE "public"."sr_status" AS ENUM('NEW', 'TRIAGED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED');--> statement-breakpoint
CREATE TYPE "public"."function_type" AS ENUM('PRIMARY', 'SECONDARY', 'PROTECTIVE');--> statement-breakpoint
CREATE TYPE "public"."failure_type" AS ENUM('TOTAL_LOSS', 'PARTIAL_LOSS', 'INTERMITTENT', 'OVER_PERFORMANCE');--> statement-breakpoint
CREATE TYPE "public"."failure_mode_category" AS ENUM('MECHANICAL', 'ELECTRICAL', 'INSTRUMENTATION', 'PROCESS', 'STRUCTURAL', 'HUMAN_ERROR');--> statement-breakpoint
CREATE TYPE "public"."fmea_status" AS ENUM('DRAFT', 'IN_PROGRESS', 'REVIEW', 'APPROVED');--> statement-breakpoint
CREATE TYPE "public"."fmea_worksheet_status" AS ENUM('OPEN', 'IN_PROGRESS', 'COMPLETED', 'DEFERRED');--> statement-breakpoint
CREATE TYPE "public"."discovery_method" AS ENUM('OPERATOR', 'ALARM', 'INSPECTION', 'PREDICTIVE');--> statement-breakpoint
CREATE TYPE "public"."consequence_type" AS ENUM('HIDDEN', 'SAFETY', 'ENVIRONMENTAL', 'OPERATIONAL', 'NON_OPERATIONAL');--> statement-breakpoint
CREATE TYPE "public"."rcm_decision_type" AS ENUM('ON_CONDITION', 'SCHEDULED_RESTORATION', 'SCHEDULED_DISCARD', 'FAILURE_FINDING', 'REDESIGN', 'RUN_TO_FAILURE');--> statement-breakpoint
CREATE TYPE "public"."criticality_methodology" AS ENUM('QUALITATIVE', 'SEMI_QUANTITATIVE', 'QUANTITATIVE', 'RISK_MATRIX');--> statement-breakpoint
CREATE TYPE "public"."overall_criticality" AS ENUM('A', 'B', 'C', 'D');--> statement-breakpoint
CREATE TYPE "public"."rca_methodology" AS ENUM('FIVE_WHY', 'FISHBONE', 'FAULT_TREE', 'TAPROOT', 'HYBRID');--> statement-breakpoint
CREATE TYPE "public"."rca_status" AS ENUM('IN_PROGRESS', 'REVIEW', 'COMPLETED', 'CLOSED');--> statement-breakpoint
CREATE TYPE "public"."factor_category" AS ENUM('MAN', 'MACHINE', 'METHOD', 'MATERIAL', 'ENVIRONMENT', 'MANAGEMENT');--> statement-breakpoint
CREATE TYPE "public"."failure_pattern" AS ENUM('INFANT_MORTALITY', 'RANDOM', 'WEAR_OUT');--> statement-breakpoint
CREATE TYPE "public"."ram_analysis_type" AS ENUM('SERIES', 'PARALLEL', 'COMPLEX', 'MONTE_CARLO');--> statement-breakpoint
CREATE TYPE "public"."redundancy_type" AS ENUM('NONE', 'ACTIVE', 'STANDBY', 'N_PLUS_1');--> statement-breakpoint
CREATE TYPE "public"."system_position" AS ENUM('SERIES', 'PARALLEL');--> statement-breakpoint
CREATE TYPE "public"."task_package_type" AS ENUM('INTERVAL_BASED', 'TRADE_BASED', 'ROUTE_BASED', 'SHUTDOWN');--> statement-breakpoint
CREATE TYPE "public"."uniclass_table" AS ENUM('ENTITIES', 'ACTIVITIES', 'SPACES', 'ELEMENTS', 'SYSTEMS', 'PRODUCTS', 'ROLES');--> statement-breakpoint
CREATE TYPE "public"."iso14224_level" AS ENUM('INDUSTRY', 'BUSINESS_CATEGORY', 'INSTALLATION', 'PLANT_SECTION', 'EQUIPMENT_CLASS', 'EQUIPMENT_TYPE');--> statement-breakpoint
CREATE TYPE "public"."cause_category" AS ENUM('DESIGN', 'FABRICATION', 'INSTALLATION', 'OPERATION', 'MAINTENANCE', 'MANAGEMENT', 'MISCELLANEOUS');--> statement-breakpoint
CREATE TYPE "public"."sensor_type" AS ENUM('TEMPERATURE', 'PRESSURE', 'VIBRATION', 'FLOW', 'LEVEL', 'SPEED', 'CURRENT', 'VOLTAGE', 'HUMIDITY', 'CUSTOM');--> statement-breakpoint
CREATE TYPE "public"."reading_quality" AS ENUM('GOOD', 'BAD', 'UNCERTAIN', 'SUBSTITUTED');--> statement-breakpoint
CREATE TYPE "public"."telemetry_event_type" AS ENUM('ALARM', 'WARNING', 'RETURN_TO_NORMAL', 'COMMUNICATION_LOSS', 'CALIBRATION');--> statement-breakpoint
CREATE TYPE "public"."telemetry_severity" AS ENUM('INFO', 'WARNING', 'CRITICAL');--> statement-breakpoint
CREATE TYPE "public"."alert_rule_type" AS ENUM('THRESHOLD', 'RATE_OF_CHANGE', 'ANOMALY', 'PATTERN');--> statement-breakpoint
CREATE TYPE "public"."ifc_version" AS ENUM('IFC2X3', 'IFC4', 'IFC4X3');--> statement-breakpoint
CREATE TYPE "public"."model_status" AS ENUM('UPLOADING', 'PROCESSING', 'READY', 'ERROR');--> statement-breakpoint
CREATE TYPE "public"."element_link_type" AS ENUM('PRIMARY', 'SECONDARY', 'REFERENCE');--> statement-breakpoint
CREATE TYPE "public"."inspection_result" AS ENUM('PASS', 'FAIL', 'CONDITIONAL', 'NOT_APPLICABLE');--> statement-breakpoint
CREATE TYPE "public"."violation_severity" AS ENUM('MINOR', 'MAJOR', 'CRITICAL', 'WILLFUL');--> statement-breakpoint
CREATE TYPE "public"."violation_status" AS ENUM('OPEN', 'UNDER_REVIEW', 'CORRECTIVE_ACTION', 'CLOSED', 'APPEALED');--> statement-breakpoint
CREATE TYPE "public"."ca_source_type" AS ENUM('VIOLATION', 'INSPECTION', 'RCA', 'AUDIT', 'OBSERVATION');--> statement-breakpoint
CREATE TYPE "public"."ca_status" AS ENUM('OPEN', 'IN_PROGRESS', 'COMPLETED', 'VERIFIED', 'OVERDUE');--> statement-breakpoint
CREATE TYPE "public"."audit_result" AS ENUM('PASS', 'CONDITIONAL', 'FAIL');--> statement-breakpoint
CREATE TYPE "public"."audit_type" AS ENUM('INTERNAL', 'EXTERNAL', 'REGULATORY', 'CERTIFICATION');--> statement-breakpoint
CREATE TYPE "public"."meter_type" AS ENUM('RUNTIME_HOURS', 'CYCLES', 'MILEAGE', 'PRODUCTION_COUNT', 'ENERGY');--> statement-breakpoint
CREATE TYPE "public"."kpi_category" AS ENUM('RELIABILITY', 'AVAILABILITY', 'COST', 'SAFETY', 'COMPLIANCE', 'PERFORMANCE');--> statement-breakpoint
CREATE TYPE "public"."kpi_status" AS ENUM('ON_TARGET', 'WARNING', 'CRITICAL');--> statement-breakpoint
CREATE TYPE "public"."kpi_trend" AS ENUM('IMPROVING', 'STABLE', 'DECLINING');--> statement-breakpoint
CREATE TABLE "tenants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"domain" varchar(255),
	"plan" "tenant_plan" DEFAULT 'FREE' NOT NULL,
	"settings" jsonb DEFAULT '{}'::jsonb,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"email" varchar(320) NOT NULL,
	"password_hash" text,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"role" "user_role" DEFAULT 'VIEWER' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "role_assignments" (
	"user_id" uuid NOT NULL,
	"role_id" uuid NOT NULL,
	"tenant_id" uuid NOT NULL,
	"assigned_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "role_assignments_user_id_role_id_pk" PRIMARY KEY("user_id","role_id")
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"permissions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"user_id" uuid,
	"action" "audit_action" NOT NULL,
	"entity_type" varchar(100) NOT NULL,
	"entity_id" uuid,
	"old_values" jsonb,
	"new_values" jsonb,
	"ip_address" varchar(45),
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"tenant_id" uuid NOT NULL,
	"token" text NOT NULL,
	"refresh_token" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"ip_address" varchar(45),
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token"),
	CONSTRAINT "sessions_refresh_token_unique" UNIQUE("refresh_token")
);
--> statement-breakpoint
CREATE TABLE "sso_providers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"provider_type" "sso_provider_type" NOT NULL,
	"name" varchar(255) NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sso_user_mappings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"provider_id" uuid NOT NULL,
	"external_user_id" varchar(512) NOT NULL,
	"external_email" varchar(320),
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "api_keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"created_by" uuid,
	"name" varchar(255) NOT NULL,
	"key_hash" text NOT NULL,
	"key_prefix" varchar(12) NOT NULL,
	"permissions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"expires_at" timestamp with time zone,
	"last_used_at" timestamp with time zone,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "api_keys_key_hash_unique" UNIQUE("key_hash")
);
--> statement-breakpoint
CREATE TABLE "mfa_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"tenant_id" uuid NOT NULL,
	"method" "mfa_method" NOT NULL,
	"secret" text NOT NULL,
	"backup_codes" text,
	"is_verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"verified_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"tag_number" varchar(100) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"asset_type_id" uuid,
	"parent_asset_id" uuid,
	"functional_location_id" uuid,
	"serial_number" varchar(255),
	"manufacturer" varchar(255),
	"model" varchar(255),
	"install_date" date,
	"commission_date" date,
	"status" "asset_status" DEFAULT 'PLANNED' NOT NULL,
	"criticality" "asset_criticality" DEFAULT 'C' NOT NULL,
	"warranty_expiry" date,
	"photo_url" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "asset_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"code" varchar(50) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"parent_type_id" uuid,
	"category" varchar(100),
	"icon_name" varchar(100),
	"default_attributes" jsonb DEFAULT '[]'::jsonb,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "asset_hierarchy" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"parent_asset_id" uuid NOT NULL,
	"child_asset_id" uuid NOT NULL,
	"relationship_type" "hierarchy_relationship_type" DEFAULT 'PHYSICAL' NOT NULL,
	"position" integer DEFAULT 0,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "functional_locations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"code" varchar(100) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"parent_id" uuid,
	"location_type" "location_type" NOT NULL,
	"address" text,
	"coordinates" jsonb,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "asset_attributes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"asset_id" uuid NOT NULL,
	"attribute_name" varchar(255) NOT NULL,
	"attribute_value" text,
	"data_type" varchar(50) DEFAULT 'STRING' NOT NULL,
	"unit_of_measure" varchar(50),
	"source" varchar(100),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "asset_lifecycle_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"asset_id" uuid NOT NULL,
	"event_type" "lifecycle_event_type" NOT NULL,
	"event_date" date NOT NULL,
	"description" text,
	"cost" numeric(15, 2),
	"performed_by" uuid,
	"document_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "asset_classifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"asset_id" uuid NOT NULL,
	"classification_system" varchar(50) NOT NULL,
	"class_code" varchar(100) NOT NULL,
	"class_name" varchar(255),
	"level" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "information_containers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"container_code" varchar(100) NOT NULL,
	"title" varchar(500) NOT NULL,
	"description" text,
	"container_type" "container_type" NOT NULL,
	"format" varchar(50),
	"version" varchar(50),
	"file_size" integer,
	"file_path" text,
	"mime_type" varchar(255),
	"status" varchar(50) DEFAULT 'ACTIVE' NOT NULL,
	"cde_state_id" uuid,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cde_states" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"container_id" uuid NOT NULL,
	"state" "cde_state" NOT NULL,
	"previous_state" "cde_state",
	"changed_by" uuid,
	"reason" text,
	"changed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cde_workflow_definitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"from_state" "cde_state" NOT NULL,
	"to_state" "cde_state" NOT NULL,
	"required_role" varchar(100),
	"auto_transition" boolean DEFAULT false NOT NULL,
	"conditions" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cde_workflow_transitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"container_id" uuid NOT NULL,
	"workflow_id" uuid NOT NULL,
	"from_state" "cde_state" NOT NULL,
	"to_state" "cde_state" NOT NULL,
	"triggered_by" uuid,
	"notes" text,
	"transitioned_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "document_registry" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"container_id" uuid NOT NULL,
	"document_number" varchar(100) NOT NULL,
	"document_title" varchar(500) NOT NULL,
	"document_type" varchar(100),
	"discipline" varchar(100),
	"revision" varchar(50),
	"asset_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revision_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"container_id" uuid NOT NULL,
	"tenant_id" uuid NOT NULL,
	"revision_number" varchar(50) NOT NULL,
	"revision_date" timestamp with time zone DEFAULT now() NOT NULL,
	"description" text,
	"changed_by" uuid,
	"previous_version_id" uuid,
	"change_type" "change_type" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "handover_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"package_id" uuid NOT NULL,
	"asset_id" uuid,
	"info_container_id" uuid,
	"air_requirement_id" uuid,
	"item_type" varchar(100),
	"status" "handover_item_status" DEFAULT 'PENDING' NOT NULL,
	"validation_notes" text,
	"validated_by" uuid,
	"validated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "handover_packages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"project_id" uuid,
	"type" "handover_type" NOT NULL,
	"status" "handover_status" DEFAULT 'PREPARING' NOT NULL,
	"submitted_by" uuid,
	"submitted_at" timestamp with time zone,
	"reviewed_by" uuid,
	"reviewed_at" timestamp with time zone,
	"acceptance_criteria" text,
	"rejection_reason" text,
	"completeness_score" numeric(5, 2),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "data_quality_issues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"rule_id" uuid NOT NULL,
	"record_table" varchar(255) NOT NULL,
	"record_id" uuid NOT NULL,
	"field_name" varchar(255),
	"current_value" text,
	"expected_value" text,
	"status" "dq_issue_status" DEFAULT 'OPEN' NOT NULL,
	"assigned_to" uuid,
	"detected_at" timestamp with time zone DEFAULT now() NOT NULL,
	"resolved_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "data_quality_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"target_table" varchar(255) NOT NULL,
	"target_field" varchar(255),
	"rule_type" "dq_rule_type" NOT NULL,
	"rule_expression" text NOT NULL,
	"severity" "dq_severity" DEFAULT 'MEDIUM' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "data_quality_scores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"scan_date" timestamp with time zone DEFAULT now() NOT NULL,
	"target_table" varchar(255) NOT NULL,
	"total_records" integer NOT NULL,
	"records_passing" integer NOT NULL,
	"records_failing" integer NOT NULL,
	"completeness_percent" numeric(5, 2),
	"accuracy_percent" numeric(5, 2),
	"overall_score" numeric(5, 2)
);
--> statement-breakpoint
CREATE TABLE "data_dictionary_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"property_name" varchar(255) NOT NULL,
	"display_name" varchar(255),
	"definition" text,
	"data_type" varchar(50) NOT NULL,
	"unit_of_measure" varchar(50),
	"allowed_values" jsonb,
	"validation_regex" varchar(500),
	"source_standard" varchar(100),
	"property_set" varchar(255),
	"applicable_asset_types" uuid[],
	"is_mandatory" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "digital_twin_instances" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"asset_id" uuid NOT NULL,
	"ifc_element_id" varchar(255),
	"twin_status" "twin_status" DEFAULT 'DISCONNECTED' NOT NULL,
	"last_sync_at" timestamp with time zone,
	"sync_frequency_sec" integer,
	"live_state" jsonb,
	"spatial_coordinates" jsonb,
	"metadata_hash" varchar(128),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "twin_state_history" (
	"time" timestamp with time zone DEFAULT now() NOT NULL,
	"twin_id" uuid NOT NULL,
	"state_snapshot" jsonb,
	"change_source" varchar(100)
);
--> statement-breakpoint
CREATE TABLE "organizational_info_requirements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"code" varchar(50) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"category" varchar(100),
	"priority" "oir_priority" DEFAULT 'MEDIUM' NOT NULL,
	"lifecycle_stage" "lifecycle_stage",
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "asset_info_requirements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"oir_id" uuid NOT NULL,
	"asset_type_id" uuid,
	"requirement_name" varchar(255) NOT NULL,
	"description" text,
	"data_field" varchar(255) NOT NULL,
	"data_type" varchar(50) NOT NULL,
	"is_mandatory" boolean DEFAULT false NOT NULL,
	"validation_rule" text,
	"lifecycle_stage" "lifecycle_stage",
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exchange_info_requirements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"air_id" uuid NOT NULL,
	"delivery_milestone" varchar(255),
	"responsible_party" varchar(255),
	"format" varchar(100),
	"exchange_method" "exchange_method",
	"due_date" date,
	"status" "eir_status" DEFAULT 'DRAFT' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "air_compliance_checks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"asset_id" uuid NOT NULL,
	"air_id" uuid NOT NULL,
	"check_date" timestamp with time zone DEFAULT now() NOT NULL,
	"is_passing" boolean NOT NULL,
	"score" numeric(5, 2),
	"missing_fields" jsonb,
	"checked_by" uuid,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "idp_deliverables" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plan_id" uuid NOT NULL,
	"eir_id" uuid NOT NULL,
	"container_id" uuid,
	"status" "idp_deliverable_status" DEFAULT 'PENDING' NOT NULL,
	"due_date" date,
	"delivered_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "information_delivery_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"project_id" uuid,
	"type" "idp_type" NOT NULL,
	"status" "idp_status" DEFAULT 'DRAFT' NOT NULL,
	"milestones" jsonb,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "loin_definitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"air_id" uuid NOT NULL,
	"asset_type_id" uuid,
	"lifecycle_stage" "lifecycle_stage",
	"purpose" text,
	"geometry_detail_level" varchar(50),
	"geometry_dimensionality" varchar(10),
	"geometry_appearance" varchar(100),
	"geometry_parametric" varchar(100),
	"alphanumeric_properties" jsonb,
	"alphanumeric_identification" jsonb,
	"documentation_required" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "work_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"wo_number" varchar(50) NOT NULL,
	"asset_id" uuid,
	"type" "work_order_type" NOT NULL,
	"status" "work_order_status" DEFAULT 'DRAFT' NOT NULL,
	"priority" "work_order_priority" DEFAULT 'MEDIUM' NOT NULL,
	"description" varchar(500) NOT NULL,
	"long_description" text,
	"reported_by" uuid,
	"assigned_to" uuid,
	"crew_id" uuid,
	"maintenance_plan_id" uuid,
	"service_request_id" uuid,
	"estimated_hours" numeric(8, 2),
	"actual_hours" numeric(8, 2),
	"estimated_cost" numeric(14, 2),
	"actual_cost" numeric(14, 2),
	"scheduled_start" timestamp with time zone,
	"scheduled_end" timestamp with time zone,
	"actual_start" timestamp with time zone,
	"actual_end" timestamp with time zone,
	"completion_notes" text,
	"failure_mode_id" uuid,
	"failure_code_id" uuid,
	"cause_code_id" uuid,
	"parent_wo_id" uuid,
	"safety_requirements" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "work_order_approvals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"work_order_id" uuid NOT NULL,
	"approval_step" integer NOT NULL,
	"approver_role" varchar(100) NOT NULL,
	"approver_id" uuid,
	"status" "approval_status" DEFAULT 'PENDING' NOT NULL,
	"comments" text,
	"decided_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "maintenance_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"plan_code" varchar(50) NOT NULL,
	"name" varchar(200) NOT NULL,
	"description" text,
	"asset_id" uuid,
	"asset_type_id" uuid,
	"plan_type" "maintenance_plan_type" NOT NULL,
	"frequency_days" integer,
	"frequency_meter_id" uuid,
	"trigger_value" numeric(14, 4),
	"trigger_operator" varchar(10),
	"is_active" boolean DEFAULT true NOT NULL,
	"last_generated_date" date,
	"next_due_date" date,
	"lead_time_days" integer,
	"estimated_duration" numeric(8, 2),
	"estimated_cost" numeric(14, 2),
	"wo_template" jsonb,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "maintenance_tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"work_order_id" uuid NOT NULL,
	"task_number" integer NOT NULL,
	"description" text NOT NULL,
	"task_type" "maintenance_task_type" NOT NULL,
	"estimated_minutes" integer,
	"actual_minutes" integer,
	"status" "maintenance_task_status" DEFAULT 'PENDING' NOT NULL,
	"sequence" integer NOT NULL,
	"tools_required" text,
	"safety_notes" text,
	"completed_by" uuid,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "spare_parts_usage" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"work_order_id" uuid NOT NULL,
	"task_id" uuid,
	"stock_item_id" uuid NOT NULL,
	"quantity_used" numeric(12, 4) NOT NULL,
	"unit_cost" numeric(14, 2),
	"total_cost" numeric(14, 2),
	"issued_by" uuid,
	"issued_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "maintenance_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"asset_id" uuid NOT NULL,
	"work_order_id" uuid,
	"event_type" varchar(50) NOT NULL,
	"completion_date" timestamp with time zone NOT NULL,
	"summary" text,
	"labor_hours" numeric(8, 2),
	"labor_cost" numeric(14, 2),
	"material_cost" numeric(14, 2),
	"total_cost" numeric(14, 2),
	"downtime_hours" numeric(8, 2),
	"is_planned" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "maintenance_routes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"route_code" varchar(50) NOT NULL,
	"name" varchar(200) NOT NULL,
	"description" text,
	"site_id" uuid,
	"estimated_duration_min" integer,
	"frequency_days" integer,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "route_stops" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"route_id" uuid NOT NULL,
	"asset_id" uuid NOT NULL,
	"stop_sequence" integer NOT NULL,
	"inspection_checklist" jsonb,
	"estimated_minutes" integer,
	"instructions" text
);
--> statement-breakpoint
CREATE TABLE "route_executions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"route_id" uuid NOT NULL,
	"executed_by" uuid NOT NULL,
	"started_at" timestamp with time zone NOT NULL,
	"completed_at" timestamp with time zone,
	"status" "route_execution_status" DEFAULT 'IN_PROGRESS' NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "route_stop_readings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"execution_id" uuid NOT NULL,
	"stop_id" uuid NOT NULL,
	"reading" jsonb,
	"status" "route_stop_reading_status" DEFAULT 'PENDING' NOT NULL,
	"completed_at" timestamp with time zone,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "shutdown_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"name" varchar(200) NOT NULL,
	"type" "shutdown_type" NOT NULL,
	"site_id" uuid,
	"status" "shutdown_status" DEFAULT 'PLANNING' NOT NULL,
	"planned_start" timestamp with time zone,
	"planned_end" timestamp with time zone,
	"actual_start" timestamp with time zone,
	"actual_end" timestamp with time zone,
	"budget" numeric(14, 2),
	"actual_cost" numeric(14, 2),
	"manager_id" uuid,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "shutdown_scope_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"shutdown_id" uuid NOT NULL,
	"asset_id" uuid NOT NULL,
	"work_order_id" uuid,
	"scope_type" "shutdown_scope_type" NOT NULL,
	"priority" "shutdown_scope_priority" DEFAULT 'MEDIUM' NOT NULL,
	"estimated_hours" numeric(8, 2),
	"status" "shutdown_scope_status" DEFAULT 'PENDING' NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "crafts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"code" varchar(30) NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"standard_rate" numeric(10, 2),
	"overtime_rate" numeric(10, 2),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "craft_certifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"craft_id" uuid NOT NULL,
	"certification_name" varchar(200) NOT NULL,
	"certifying_body" varchar(200),
	"certificate_number" varchar(100),
	"issued_date" date NOT NULL,
	"expiry_date" date,
	"status" "certification_status" DEFAULT 'ACTIVE' NOT NULL,
	"document_id" uuid,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "crews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"supervisor_id" uuid,
	"site_id" uuid,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "crew_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"crew_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" "crew_member_role" DEFAULT 'MEMBER' NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now(),
	"left_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "shifts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"break_duration_min" integer DEFAULT 0,
	"days_of_week" smallint[] NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "labor_rates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"craft_id" uuid NOT NULL,
	"effective_date" date NOT NULL,
	"regular_rate" numeric(10, 2) NOT NULL,
	"overtime_rate" numeric(10, 2),
	"double_time_rate" numeric(10, 2),
	"currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "labor_bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"work_order_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"craft_id" uuid NOT NULL,
	"start_time" timestamp with time zone NOT NULL,
	"end_time" timestamp with time zone,
	"hours_regular" numeric(6, 2),
	"hours_overtime" numeric(6, 2),
	"rate_applied" numeric(10, 2),
	"total_cost" numeric(14, 2),
	"status" "labor_booking_status" DEFAULT 'PLANNED' NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "labor_availability" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"shift_id" uuid,
	"date" date NOT NULL,
	"availability_type" "availability_type" DEFAULT 'AVAILABLE' NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "storerooms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"code" varchar(30) NOT NULL,
	"name" varchar(150) NOT NULL,
	"location_id" uuid,
	"type" "storeroom_type" DEFAULT 'GENERAL' NOT NULL,
	"manager_id" uuid,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stock_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"part_number" varchar(80) NOT NULL,
	"description" text NOT NULL,
	"category" varchar(100),
	"unit_of_issue" varchar(30) NOT NULL,
	"manufacturer" varchar(150),
	"manufacturer_part_no" varchar(80),
	"is_critical_spare" boolean DEFAULT false NOT NULL,
	"is_rotable" boolean DEFAULT false NOT NULL,
	"lead_time_days" integer,
	"shelf_life_days" integer,
	"hazmat_class" varchar(30),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "stock_levels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"stock_item_id" uuid NOT NULL,
	"storeroom_id" uuid NOT NULL,
	"bin_location" varchar(50),
	"qty_on_hand" numeric(14, 4) DEFAULT '0' NOT NULL,
	"qty_reserved" numeric(14, 4) DEFAULT '0' NOT NULL,
	"qty_on_order" numeric(14, 4) DEFAULT '0' NOT NULL,
	"reorder_point" numeric(14, 4),
	"reorder_qty" numeric(14, 4),
	"max_qty" numeric(14, 4),
	"unit_cost" numeric(14, 4),
	"last_receipt_date" date,
	"last_issue_date" date
);
--> statement-breakpoint
CREATE TABLE "stock_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"stock_item_id" uuid NOT NULL,
	"storeroom_id" uuid NOT NULL,
	"transaction_type" "stock_transaction_type" NOT NULL,
	"quantity" numeric(14, 4) NOT NULL,
	"unit_cost" numeric(14, 4),
	"work_order_id" uuid,
	"po_line_id" uuid,
	"dest_storeroom_id" uuid,
	"reference_number" varchar(50),
	"performed_by" uuid NOT NULL,
	"performed_at" timestamp with time zone DEFAULT now(),
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "bill_of_materials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"asset_id" uuid NOT NULL,
	"stock_item_id" uuid NOT NULL,
	"quantity" numeric(12, 4) NOT NULL,
	"is_critical" boolean DEFAULT false NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "cycle_count_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"count_id" uuid NOT NULL,
	"stock_item_id" uuid NOT NULL,
	"system_qty" numeric(14, 4) NOT NULL,
	"counted_qty" numeric(14, 4),
	"variance" numeric(14, 4),
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "cycle_counts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"storeroom_id" uuid NOT NULL,
	"count_date" date NOT NULL,
	"status" "cycle_count_status" DEFAULT 'PLANNED' NOT NULL,
	"counted_by" uuid,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "reorder_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"stock_item_id" uuid NOT NULL,
	"storeroom_id" uuid NOT NULL,
	"rule_type" "reorder_rule_type" NOT NULL,
	"min_qty" numeric(14, 4),
	"max_qty" numeric(14, 4),
	"reorder_point" numeric(14, 4),
	"reorder_qty" numeric(14, 4),
	"auto_reorder" boolean DEFAULT false NOT NULL,
	"preferred_vendor_id" uuid,
	"lead_time_days" integer,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vendors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"code" varchar(20) NOT NULL,
	"name" varchar(300) NOT NULL,
	"type" "vendor_type" DEFAULT 'SUPPLIER',
	"contact_name" varchar(200),
	"email" varchar(200),
	"phone" varchar(50),
	"address" text,
	"tax_id" varchar(50),
	"payment_terms" varchar(50),
	"currency" varchar(3) DEFAULT 'USD',
	"is_approved" boolean DEFAULT false,
	"approval_date" date,
	"rating" numeric(3, 2),
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "vendor_ratings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"vendor_id" uuid NOT NULL,
	"rating_period" date NOT NULL,
	"quality_score" numeric(3, 2),
	"delivery_score" numeric(3, 2),
	"price_score" numeric(3, 2),
	"service_score" numeric(3, 2),
	"overall_score" numeric(3, 2) NOT NULL,
	"rated_by" uuid,
	"rated_at" timestamp with time zone DEFAULT now(),
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "purchase_requisitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"req_number" varchar(30) NOT NULL,
	"status" "pr_status" DEFAULT 'DRAFT',
	"requested_by" uuid NOT NULL,
	"approved_by" uuid,
	"work_order_id" uuid,
	"cost_center_id" uuid,
	"total_estimated" numeric(15, 2),
	"justification" text,
	"needed_by_date" date,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "purchase_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"po_number" varchar(30) NOT NULL,
	"vendor_id" uuid NOT NULL,
	"status" "po_status" DEFAULT 'DRAFT',
	"requisition_id" uuid,
	"cost_center_id" uuid,
	"currency" varchar(3) DEFAULT 'USD',
	"total_amount" numeric(15, 2),
	"tax_amount" numeric(15, 2),
	"shipping_address" text,
	"terms" text,
	"expected_delivery_date" date,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "po_line_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"purchase_order_id" uuid NOT NULL,
	"line_number" integer NOT NULL,
	"stock_item_id" uuid,
	"description" varchar(500) NOT NULL,
	"quantity" numeric(12, 3) NOT NULL,
	"unit_price" numeric(12, 4) NOT NULL,
	"total_price" numeric(15, 2) NOT NULL,
	"quantity_received" numeric(12, 3) DEFAULT '0',
	"status" "po_line_status" DEFAULT 'OPEN'
);
--> statement-breakpoint
CREATE TABLE "goods_receipt_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"receipt_id" uuid NOT NULL,
	"po_line_id" uuid NOT NULL,
	"stock_item_id" uuid,
	"quantity_received" numeric(12, 3) NOT NULL,
	"quantity_accepted" numeric(12, 3) NOT NULL,
	"quantity_rejected" numeric(12, 3) DEFAULT '0',
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "goods_receipts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"receipt_number" varchar(30) NOT NULL,
	"purchase_order_id" uuid NOT NULL,
	"received_by" uuid NOT NULL,
	"received_at" timestamp with time zone DEFAULT now(),
	"storeroom_id" uuid,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "invoice_matching" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"invoice_number" varchar(50) NOT NULL,
	"vendor_id" uuid NOT NULL,
	"purchase_order_id" uuid,
	"invoice_date" date NOT NULL,
	"due_date" date,
	"total_amount" numeric(15, 2) NOT NULL,
	"tax_amount" numeric(15, 2),
	"status" "invoice_status" DEFAULT 'PENDING',
	"matched_by" uuid,
	"matched_at" timestamp with time zone,
	"payment_reference" varchar(100)
);
--> statement-breakpoint
CREATE TABLE "warranty_terms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"duration_months" integer NOT NULL,
	"coverage_type" "warranty_coverage_type" NOT NULL,
	"terms" text,
	"vendor_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "warranty_coverage" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"asset_id" uuid NOT NULL,
	"warranty_term_id" uuid NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"status" "warranty_coverage_status" DEFAULT 'ACTIVE' NOT NULL,
	"purchase_order_id" uuid,
	"serial_number" varchar(100),
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "warranty_claims" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"coverage_id" uuid NOT NULL,
	"claim_number" varchar(50) NOT NULL,
	"work_order_id" uuid,
	"claim_date" date NOT NULL,
	"description" text,
	"claim_amount" numeric(14, 2),
	"approved_amount" numeric(14, 2),
	"status" "warranty_claim_status" DEFAULT 'SUBMITTED' NOT NULL,
	"vendor_response" text,
	"resolved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sla_definitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"category" varchar(100),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sla_targets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"sla_id" uuid NOT NULL,
	"metric_name" "sla_metric_name" NOT NULL,
	"target_value" numeric(12, 4) NOT NULL,
	"unit_of_measure" varchar(50) NOT NULL,
	"priority" integer,
	"warning_threshold" numeric(12, 4),
	"critical_threshold" numeric(12, 4)
);
--> statement-breakpoint
CREATE TABLE "sla_tracking" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"sla_target_id" uuid NOT NULL,
	"work_order_id" uuid,
	"asset_id" uuid,
	"started_at" timestamp with time zone NOT NULL,
	"responded_at" timestamp with time zone,
	"resolved_at" timestamp with time zone,
	"actual_value" numeric(12, 4),
	"target_value" numeric(12, 4) NOT NULL,
	"is_passing" boolean,
	"breach_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "sla_breaches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"tracking_id" uuid NOT NULL,
	"breach_type" "sla_breach_type" NOT NULL,
	"breached_at" timestamp with time zone NOT NULL,
	"escalated_to" uuid,
	"escalation_level" integer DEFAULT 0,
	"acknowledged_by" uuid,
	"acknowledged_at" timestamp with time zone,
	"root_cause" text,
	"preventive_action" text
);
--> statement-breakpoint
CREATE TABLE "contractors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"code" varchar(50) NOT NULL,
	"name" varchar(255) NOT NULL,
	"contact_name" varchar(200),
	"email" varchar(320),
	"phone" varchar(30),
	"address" text,
	"tax_id" varchar(50),
	"insurance_expiry" date,
	"safety_rating" numeric(3, 1),
	"is_approved" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contracts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"contractor_id" uuid NOT NULL,
	"contract_number" varchar(50) NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" "contract_type" NOT NULL,
	"status" "contract_status" DEFAULT 'DRAFT' NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date,
	"total_value" numeric(14, 2),
	"currency" varchar(3) DEFAULT 'USD',
	"terms" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contract_line_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"contract_id" uuid NOT NULL,
	"line_number" integer NOT NULL,
	"description" text NOT NULL,
	"unit_price" numeric(14, 2) NOT NULL,
	"quantity" numeric(12, 4) NOT NULL,
	"total_price" numeric(14, 2) NOT NULL,
	"category" varchar(100)
);
--> statement-breakpoint
CREATE TABLE "contractor_personnel" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"contractor_id" uuid NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"email" varchar(320),
	"phone" varchar(30),
	"role" varchar(100),
	"badge_number" varchar(50),
	"site_access_expiry" date,
	"safety_induction_date" date,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contractor_safety_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"contractor_id" uuid NOT NULL,
	"personnel_id" uuid,
	"record_type" "contractor_safety_record_type" NOT NULL,
	"record_date" date NOT NULL,
	"description" text,
	"outcome" varchar(255),
	"document_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "work_permits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"permit_number" varchar(50) NOT NULL,
	"type" "work_permit_type" NOT NULL,
	"work_order_id" uuid,
	"asset_id" uuid,
	"location_id" uuid,
	"status" "work_permit_status" DEFAULT 'REQUESTED' NOT NULL,
	"requested_by" uuid NOT NULL,
	"issued_by" uuid,
	"issued_at" timestamp with time zone,
	"valid_from" timestamp with time zone,
	"valid_to" timestamp with time zone,
	"closed_at" timestamp with time zone,
	"hazards" jsonb,
	"precautions" jsonb,
	"ppe_required" jsonb,
	"emergency_procedure" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "permit_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"code" varchar(50) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"required_approvals" integer DEFAULT 1 NOT NULL,
	"max_duration_hours" integer,
	"renewal_allowed" boolean DEFAULT false NOT NULL,
	"checklist" jsonb,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "isolation_points" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"asset_id" uuid NOT NULL,
	"point_number" varchar(50) NOT NULL,
	"point_type" "isolation_point_type" NOT NULL,
	"description" text,
	"location" varchar(255),
	"lock_type" varchar(100),
	"normal_state" varchar(50),
	"tag_id" varchar(100)
);
--> statement-breakpoint
CREATE TABLE "loto_applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"procedure_id" uuid NOT NULL,
	"work_permit_id" uuid,
	"applied_by" uuid NOT NULL,
	"applied_at" timestamp with time zone NOT NULL,
	"removed_by" uuid,
	"removed_at" timestamp with time zone,
	"status" "loto_application_status" DEFAULT 'APPLIED' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "loto_procedures" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"asset_id" uuid NOT NULL,
	"procedure_number" varchar(50) NOT NULL,
	"name" varchar(255) NOT NULL,
	"steps" jsonb,
	"isolation_point_ids" uuid[],
	"verified_by" uuid,
	"verified_at" timestamp with time zone,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "safety_observations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"observation_type" "safety_observation_type" NOT NULL,
	"location_id" uuid,
	"description" text NOT NULL,
	"reported_by" uuid NOT NULL,
	"reported_at" timestamp with time zone DEFAULT now() NOT NULL,
	"severity" integer,
	"corrective_action" text,
	"status" "safety_observation_status" DEFAULT 'OPEN' NOT NULL,
	"resolved_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "cost_centers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"code" varchar(30) NOT NULL,
	"name" varchar(200) NOT NULL,
	"parent_id" uuid,
	"manager_id" uuid,
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "budgets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"cost_center_id" uuid NOT NULL,
	"fiscal_year" integer NOT NULL,
	"budget_type" "budget_type" NOT NULL,
	"total_amount" numeric(15, 2) NOT NULL,
	"spent_amount" numeric(15, 2) DEFAULT '0',
	"committed_amount" numeric(15, 2) DEFAULT '0',
	"status" "budget_status" DEFAULT 'DRAFT'
);
--> statement-breakpoint
CREATE TABLE "budget_line_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"budget_id" uuid NOT NULL,
	"category" varchar(50) NOT NULL,
	"description" varchar(500),
	"amount" numeric(15, 2) NOT NULL,
	"spent_amount" numeric(15, 2) DEFAULT '0'
);
--> statement-breakpoint
CREATE TABLE "cost_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"cost_center_id" uuid NOT NULL,
	"budget_id" uuid,
	"source_type" "cost_source_type" NOT NULL,
	"source_id" uuid NOT NULL,
	"asset_id" uuid,
	"transaction_date" date NOT NULL,
	"amount" numeric(15, 2) NOT NULL,
	"cost_category" "cost_category" NOT NULL,
	"description" varchar(500),
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "depreciation_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"asset_id" uuid,
	"asset_type_id" uuid,
	"method" "depreciation_method" NOT NULL,
	"acquisition_cost" numeric(15, 2) NOT NULL,
	"salvage_value" numeric(15, 2) DEFAULT '0' NOT NULL,
	"useful_life_years" numeric(5, 1),
	"useful_life_units" numeric(15, 2),
	"declining_rate" numeric(5, 4),
	"depreciation_start_date" date NOT NULL,
	"currency" varchar(3) DEFAULT 'USD',
	"status" "depreciation_status" DEFAULT 'ACTIVE',
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "asset_or_type_check" CHECK ("depreciation_profiles"."asset_id" IS NOT NULL OR "depreciation_profiles"."asset_type_id" IS NOT NULL)
);
--> statement-breakpoint
CREATE TABLE "depreciation_schedule" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"profile_id" uuid NOT NULL,
	"asset_id" uuid NOT NULL,
	"period_start" date NOT NULL,
	"period_end" date NOT NULL,
	"period_number" integer NOT NULL,
	"opening_book_value" numeric(15, 2) NOT NULL,
	"depreciation_amount" numeric(15, 2) NOT NULL,
	"accumulated_depreciation" numeric(15, 2) NOT NULL,
	"closing_book_value" numeric(15, 2) NOT NULL,
	"units_this_period" numeric(15, 2),
	"is_posted" boolean DEFAULT false,
	"posted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "asset_valuations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"asset_id" uuid NOT NULL,
	"valuation_date" date NOT NULL,
	"valuation_type" "valuation_type" NOT NULL,
	"previous_value" numeric(15, 2),
	"new_value" numeric(15, 2) NOT NULL,
	"reason" text NOT NULL,
	"appraiser" varchar(200),
	"document_id" uuid,
	"approved_by" uuid,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "asset_cost_rollup" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"asset_id" uuid NOT NULL,
	"period_type" "period_type" NOT NULL,
	"period_start" date NOT NULL,
	"period_end" date NOT NULL,
	"labor_cost" numeric(15, 2) DEFAULT '0',
	"material_cost" numeric(15, 2) DEFAULT '0',
	"service_cost" numeric(15, 2) DEFAULT '0',
	"overhead_cost" numeric(15, 2) DEFAULT '0',
	"depreciation_cost" numeric(15, 2) DEFAULT '0',
	"preventive_cost" numeric(15, 2) DEFAULT '0',
	"corrective_cost" numeric(15, 2) DEFAULT '0',
	"predictive_cost" numeric(15, 2) DEFAULT '0',
	"emergency_cost" numeric(15, 2) DEFAULT '0',
	"project_cost" numeric(15, 2) DEFAULT '0',
	"work_order_count" integer DEFAULT 0,
	"failure_count" integer DEFAULT 0,
	"downtime_hours" numeric(10, 2) DEFAULT '0',
	"labor_hours" numeric(10, 2) DEFAULT '0',
	"budgeted_amount" numeric(15, 2),
	"calculated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "replacement_analyses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"asset_id" uuid NOT NULL,
	"analysis_date" date NOT NULL,
	"performed_by" uuid NOT NULL,
	"status" "replacement_analysis_status" DEFAULT 'DRAFT',
	"current_book_value" numeric(15, 2) NOT NULL,
	"current_market_value" numeric(15, 2),
	"age_years" numeric(5, 1) NOT NULL,
	"remaining_useful_life_years" numeric(5, 1),
	"annual_maintenance_cost_avg" numeric(15, 2) NOT NULL,
	"annual_maintenance_cost_trend" "cost_trend",
	"annual_downtime_hours" numeric(10, 2),
	"mtbf_current" numeric(10, 2),
	"replacement_cost" numeric(15, 2) NOT NULL,
	"replacement_useful_life" numeric(5, 1) NOT NULL,
	"estimated_new_annual_maint" numeric(15, 2),
	"installation_cost" numeric(15, 2) DEFAULT '0',
	"removal_disposal_cost" numeric(15, 2) DEFAULT '0',
	"cumulative_maint_cost" numeric(15, 2),
	"projected_5yr_maint_cost" numeric(15, 2),
	"projected_5yr_replace_cost" numeric(15, 2),
	"break_even_year" numeric(5, 1),
	"recommendation" "replacement_recommendation",
	"justification" text,
	"approved_by" uuid,
	"document_id" uuid,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "capital_projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"project_code" varchar(30) NOT NULL,
	"name" varchar(200) NOT NULL,
	"description" text,
	"status" "project_status" DEFAULT 'PROPOSED',
	"type" "project_type",
	"site_id" uuid,
	"project_manager_id" uuid,
	"start_date" date,
	"end_date" date,
	"budget" numeric(15, 2),
	"actual_cost" numeric(15, 2) DEFAULT '0',
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "project_phases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"project_id" uuid NOT NULL,
	"name" varchar(200) NOT NULL,
	"sequence_number" integer NOT NULL,
	"phase_status" "phase_status" DEFAULT 'NOT_STARTED',
	"start_date" date,
	"end_date" date,
	"budget" numeric(15, 2),
	"actual_cost" numeric(15, 2) DEFAULT '0'
);
--> statement-breakpoint
CREATE TABLE "project_tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"phase_id" uuid NOT NULL,
	"name" varchar(200) NOT NULL,
	"description" text,
	"assigned_to" uuid,
	"project_task_status" "project_task_status" DEFAULT 'TODO',
	"start_date" date,
	"end_date" date,
	"estimated_hours" numeric(8, 2),
	"actual_hours" numeric(8, 2) DEFAULT '0'
);
--> statement-breakpoint
CREATE TABLE "management_of_change" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"moc_number" varchar(30) NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text,
	"type" "moc_type" NOT NULL,
	"moc_status" "moc_status" DEFAULT 'DRAFT',
	"requested_by" uuid NOT NULL,
	"risk_assessment" jsonb,
	"impacted_assets" jsonb,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "moc_approvals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"moc_id" uuid NOT NULL,
	"approver_role" varchar(50) NOT NULL,
	"approver_id" uuid,
	"moc_approval_status" "moc_approval_status" DEFAULT 'PENDING',
	"comments" text,
	"decided_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "service_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"request_number" varchar(30) NOT NULL,
	"requested_by" uuid NOT NULL,
	"asset_id" uuid,
	"location_id" uuid,
	"category_id" uuid,
	"sr_priority" "sr_priority" DEFAULT 'MEDIUM',
	"sr_status" "sr_status" DEFAULT 'NEW',
	"subject" varchar(200) NOT NULL,
	"description" text,
	"work_order_id" uuid,
	"assigned_to" uuid,
	"responded_at" timestamp with time zone,
	"resolved_at" timestamp with time zone,
	"rating" integer,
	"feedback" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "request_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"code" varchar(20) NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"parent_id" uuid,
	"default_priority" varchar(20),
	"sla_id" uuid,
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "request_comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"service_request_id" uuid NOT NULL,
	"comment_by" uuid NOT NULL,
	"comment_text" text NOT NULL,
	"is_internal" boolean DEFAULT false,
	"attachment_id" uuid,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "asset_functions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"asset_id" uuid NOT NULL,
	"function_number" varchar(20) NOT NULL,
	"function_type" "function_type" NOT NULL,
	"description" text NOT NULL,
	"performance_standard" text,
	"operating_context" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "functional_failures" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"function_id" uuid NOT NULL,
	"ff_number" varchar(20) NOT NULL,
	"failure_type" "failure_type" NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "failure_modes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"functional_failure_id" uuid NOT NULL,
	"asset_type_id" uuid,
	"mode_code" varchar(30) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"category" "failure_mode_category" NOT NULL,
	"mechanism" text,
	"detectable" boolean DEFAULT true,
	"detectability" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fmea_analyses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"asset_id" uuid NOT NULL,
	"status" "fmea_status" DEFAULT 'DRAFT' NOT NULL,
	"facilitator" varchar(255),
	"analysis_date" date,
	"revision" integer DEFAULT 1 NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fmea_worksheets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"analysis_id" uuid NOT NULL,
	"failure_mode_id" uuid NOT NULL,
	"local_effect" text,
	"system_effect" text,
	"end_effect" text,
	"severity" integer NOT NULL,
	"occurrence" integer NOT NULL,
	"detection" integer NOT NULL,
	"rpn" integer GENERATED ALWAYS AS (severity * occurrence * detection) STORED,
	"current_controls" text,
	"recommended_action" text,
	"action_priority" varchar(20),
	"assigned_to" uuid,
	"due_date" date,
	"status" "fmea_worksheet_status" DEFAULT 'OPEN' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "failure_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"asset_id" uuid NOT NULL,
	"failure_mode_id" uuid,
	"work_order_id" uuid,
	"event_date" timestamp with time zone NOT NULL,
	"discovery_method" "discovery_method",
	"description" text NOT NULL,
	"impact_description" text,
	"downtime_hours" numeric(10, 2),
	"production_loss" numeric(14, 2),
	"root_cause_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rcm_decisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"failure_mode_id" uuid NOT NULL,
	"decision_type" "rcm_decision_type" NOT NULL,
	"task_description" text,
	"interval_days" integer,
	"interval_units" varchar(50),
	"task_frequency" varchar(100),
	"is_applicable" boolean DEFAULT true,
	"is_effective" boolean DEFAULT true,
	"consequence_type" "consequence_type",
	"justification" text,
	"maintenance_plan_id" uuid,
	"approved_by" uuid,
	"approved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "criticality_analyses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"asset_id" uuid NOT NULL,
	"methodology" "criticality_methodology" NOT NULL,
	"safety_impact" integer,
	"environmental_impact" integer,
	"production_impact" integer,
	"quality_impact" integer,
	"maintenance_cost_impact" integer,
	"overall_criticality" "overall_criticality",
	"score" numeric(8, 2),
	"assessed_by" uuid,
	"assessed_at" timestamp with time zone,
	"next_review_date" date,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reliability_metrics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"asset_id" uuid NOT NULL,
	"calculation_date" timestamp with time zone DEFAULT now(),
	"period_start" timestamp with time zone NOT NULL,
	"period_end" timestamp with time zone NOT NULL,
	"total_failures" numeric(10, 0) DEFAULT '0',
	"total_operating_hours" numeric(12, 2),
	"total_downtime_hours" numeric(12, 2),
	"total_repair_hours" numeric(12, 2),
	"mtbf" numeric(12, 2),
	"mttr" numeric(12, 2),
	"mttf" numeric(12, 2),
	"availability" numeric(6, 4),
	"reliability_at_mission_time" numeric(6, 4),
	"mission_time_hours" numeric(10, 2),
	"failure_rate" numeric(15, 8),
	"repair_rate" numeric(15, 8),
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "root_cause_analyses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"failure_event_id" uuid NOT NULL,
	"rca_number" varchar(30) NOT NULL,
	"methodology" "rca_methodology" NOT NULL,
	"rca_status" "rca_status" DEFAULT 'IN_PROGRESS',
	"summary" text,
	"root_cause_statement" text,
	"immediate_cause" text,
	"led_by" uuid NOT NULL,
	"started_at" timestamp with time zone DEFAULT now(),
	"completed_at" timestamp with time zone,
	"document_id" uuid
);
--> statement-breakpoint
CREATE TABLE "rca_contributing_factors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rca_id" uuid NOT NULL,
	"factor_category" "factor_category" NOT NULL,
	"level" smallint,
	"parent_factor_id" uuid,
	"description" text NOT NULL,
	"is_root_cause" boolean DEFAULT false,
	"evidence" text,
	"corrective_action_id" uuid
);
--> statement-breakpoint
CREATE TABLE "pf_curve_definitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"failure_mode_id" uuid NOT NULL,
	"pf_interval_days" numeric(8, 2) NOT NULL,
	"detection_method" varchar(100) NOT NULL,
	"detection_parameter" varchar(100),
	"p_threshold" numeric(15, 4),
	"f_threshold" numeric(15, 4),
	"monitoring_interval_days" numeric(8, 2),
	"condition_indicator" varchar(100),
	"sensor_id" uuid,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "weibull_analyses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"asset_type_id" uuid,
	"failure_mode_id" uuid,
	"analysis_name" varchar(200) NOT NULL,
	"data_points" integer NOT NULL,
	"beta" numeric(10, 4) NOT NULL,
	"eta" numeric(15, 4) NOT NULL,
	"gamma" numeric(15, 4) DEFAULT '0',
	"r_squared" numeric(6, 4),
	"mean_life" numeric(15, 4),
	"b10_life" numeric(15, 4),
	"b50_life" numeric(15, 4),
	"failure_pattern" "failure_pattern",
	"recommended_interval" numeric(10, 2),
	"analysis_date" timestamp with time zone DEFAULT now(),
	"performed_by" uuid,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "ram_analyses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"system_asset_id" uuid NOT NULL,
	"analysis_name" varchar(200) NOT NULL,
	"analysis_type" "ram_analysis_type" NOT NULL,
	"system_reliability" numeric(6, 4),
	"system_availability" numeric(6, 4),
	"system_maintainability" numeric(6, 4),
	"mission_time_hours" numeric(10, 2),
	"inherent_availability" numeric(6, 4),
	"operational_availability" numeric(6, 4),
	"target_availability" numeric(6, 4),
	"meets_target" boolean,
	"bottleneck_asset_id" uuid,
	"simulation_runs" integer,
	"analysis_date" timestamp with time zone DEFAULT now(),
	"performed_by" uuid,
	"document_id" uuid
);
--> statement-breakpoint
CREATE TABLE "ram_component_data" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ram_analysis_id" uuid NOT NULL,
	"asset_id" uuid NOT NULL,
	"mtbf_hours" numeric(12, 2),
	"mttr_hours" numeric(12, 2),
	"failure_rate" numeric(15, 8),
	"repair_rate" numeric(15, 8),
	"redundancy" "redundancy_type" DEFAULT 'NONE',
	"position_in_system" "system_position" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "task_package_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"package_id" uuid NOT NULL,
	"maintenance_task_id" uuid,
	"rcm_decision_id" uuid,
	"sequence" integer NOT NULL,
	"estimated_minutes" integer
);
--> statement-breakpoint
CREATE TABLE "task_packages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"name" varchar(200) NOT NULL,
	"description" text,
	"package_type" "task_package_type" NOT NULL,
	"interval_days" integer,
	"craft_id" uuid,
	"route_id" uuid,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "uniclass_codes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"table" "uniclass_table" NOT NULL,
	"code" varchar(30) NOT NULL,
	"title" varchar(300) NOT NULL,
	"parent_code" varchar(30),
	"level" integer NOT NULL,
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "iso14224_taxonomy" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"level" "iso14224_level" NOT NULL,
	"code" varchar(30) NOT NULL,
	"name" varchar(200) NOT NULL,
	"description" text,
	"parent_id" uuid,
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "failure_codes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"code" varchar(30) NOT NULL,
	"name" varchar(200) NOT NULL,
	"description" text,
	"category" varchar(100),
	"parent_id" uuid,
	"iso14224_ref" varchar(50),
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "cause_codes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"code" varchar(30) NOT NULL,
	"name" varchar(200) NOT NULL,
	"description" text,
	"category" "cause_category",
	"parent_id" uuid,
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "sensor_registry" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"asset_id" uuid NOT NULL,
	"sensor_code" varchar(50) NOT NULL,
	"name" varchar(200) NOT NULL,
	"sensor_type" "sensor_type" NOT NULL,
	"unit" varchar(20),
	"min_value" numeric(15, 4),
	"max_value" numeric(15, 4),
	"alarm_low" numeric(15, 4),
	"alarm_high" numeric(15, 4),
	"warning_low" numeric(15, 4),
	"warning_high" numeric(15, 4),
	"is_active" boolean DEFAULT true,
	"installed_at" date,
	"calibration_date" date,
	"next_calibration_date" date,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sensor_readings" (
	"time" timestamp with time zone NOT NULL,
	"sensor_id" uuid NOT NULL,
	"tenant_id" uuid NOT NULL,
	"value" numeric(20, 6) NOT NULL,
	"quality" "reading_quality" DEFAULT 'GOOD',
	"raw_value" numeric(20, 6)
);
--> statement-breakpoint
CREATE TABLE "telemetry_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"sensor_id" uuid NOT NULL,
	"event_type" "telemetry_event_type" NOT NULL,
	"severity" "telemetry_severity" NOT NULL,
	"value" numeric(20, 6),
	"threshold" numeric(20, 6),
	"message" varchar(500),
	"acknowledged_by" uuid,
	"acknowledged_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "data_points" (
	"time" timestamp with time zone NOT NULL,
	"tenant_id" uuid NOT NULL,
	"sensor_id" uuid NOT NULL,
	"avg_value" numeric(20, 6),
	"min_value" numeric(20, 6),
	"max_value" numeric(20, 6),
	"std_dev" numeric(20, 6),
	"sample_count" integer
);
--> statement-breakpoint
CREATE TABLE "alert_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"sensor_id" uuid NOT NULL,
	"name" varchar(200) NOT NULL,
	"rule_type" "alert_rule_type" NOT NULL,
	"condition" jsonb NOT NULL,
	"severity" varchar(20) NOT NULL,
	"is_active" boolean DEFAULT true,
	"notification_channels" jsonb,
	"cooldown_minutes" integer DEFAULT 15,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "alert_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"alert_rule_id" uuid NOT NULL,
	"sensor_id" uuid NOT NULL,
	"triggered_at" timestamp with time zone DEFAULT now(),
	"trigger_value" numeric(20, 6),
	"severity" varchar(20) NOT NULL,
	"message" varchar(500),
	"acknowledged_by" uuid,
	"acknowledged_at" timestamp with time zone,
	"resolved_at" timestamp with time zone,
	"work_order_id" uuid
);
--> statement-breakpoint
CREATE TABLE "ifc_models" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"name" varchar(200) NOT NULL,
	"version" varchar(30),
	"ifc_version" "ifc_version" DEFAULT 'IFC4',
	"file_path" text,
	"file_size" integer,
	"uploaded_by" uuid,
	"uploaded_at" timestamp with time zone DEFAULT now(),
	"model_status" "model_status" DEFAULT 'UPLOADING',
	"container_id" uuid,
	"site_id" uuid,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ifc_elements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"model_id" uuid NOT NULL,
	"ifc_global_id" varchar(22),
	"ifc_class" varchar(100) NOT NULL,
	"name" varchar(200),
	"description" text,
	"properties" jsonb,
	"geometry_blob_path" text,
	"parent_element_id" uuid,
	"storey_ref" varchar(100),
	"space_ref" varchar(100)
);
--> statement-breakpoint
CREATE TABLE "element_asset_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"ifc_element_id" uuid NOT NULL,
	"asset_id" uuid NOT NULL,
	"link_type" "element_link_type" DEFAULT 'PRIMARY',
	"linked_by" uuid,
	"linked_at" timestamp with time zone DEFAULT now(),
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "model_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"model_id" uuid NOT NULL,
	"version_number" integer NOT NULL,
	"change_description" text,
	"file_path" text,
	"file_size" integer,
	"uploaded_by" uuid,
	"uploaded_at" timestamp with time zone DEFAULT now(),
	"diff_summary" jsonb
);
--> statement-breakpoint
CREATE TABLE "regulations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"code" varchar(50) NOT NULL,
	"name" varchar(300) NOT NULL,
	"description" text,
	"authority" varchar(50) NOT NULL,
	"jurisdiction" varchar(100),
	"effective_date" date,
	"is_active" boolean DEFAULT true,
	"document_id" uuid,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "compliance_requirements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"regulation_id" uuid NOT NULL,
	"code" varchar(50) NOT NULL,
	"name" varchar(300) NOT NULL,
	"description" text,
	"requirement_type" varchar(30) NOT NULL,
	"frequency_days" integer,
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "requirement_asset_map" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"requirement_id" uuid NOT NULL,
	"asset_id" uuid,
	"asset_type_id" uuid,
	"applicability_notes" text,
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "inspections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"requirement_id" uuid NOT NULL,
	"asset_id" uuid NOT NULL,
	"inspector_id" uuid NOT NULL,
	"inspection_date" date NOT NULL,
	"next_due_date" date,
	"result" "inspection_result" NOT NULL,
	"score" numeric(5, 2),
	"findings" text,
	"document_id" uuid,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "violations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"inspection_id" uuid,
	"regulation_id" uuid NOT NULL,
	"asset_id" uuid,
	"violation_date" date NOT NULL,
	"severity" "violation_severity" NOT NULL,
	"description" text,
	"citation_number" varchar(50),
	"fine_amount" numeric(15, 2),
	"violation_status" "violation_status" DEFAULT 'OPEN',
	"closed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "corrective_actions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"source_type" "ca_source_type" NOT NULL,
	"source_id" uuid NOT NULL,
	"description" text NOT NULL,
	"assigned_to" uuid,
	"priority" varchar(20),
	"ca_status" "ca_status" DEFAULT 'OPEN',
	"due_date" date,
	"completed_at" timestamp with time zone,
	"verified_by" uuid,
	"verified_at" timestamp with time zone,
	"effectiveness_rating" varchar(20)
);
--> statement-breakpoint
CREATE TABLE "audit_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"audit_type" "audit_type" NOT NULL,
	"audit_date" date NOT NULL,
	"auditor" varchar(200),
	"scope" text,
	"findings" jsonb,
	"non_conformances" integer DEFAULT 0,
	"observations" integer DEFAULT 0,
	"recommendations" text,
	"overall_result" "audit_result",
	"next_audit_date" date,
	"document_id" uuid,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "condition_assessments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"asset_id" uuid NOT NULL,
	"assessment_date" date NOT NULL,
	"assessor_id" uuid NOT NULL,
	"methodology" varchar(100),
	"overall_score" integer NOT NULL,
	"structural_score" integer,
	"operational_score" integer,
	"aesthetic_score" integer,
	"safety_score" integer,
	"findings" text,
	"recommendations" text,
	"next_assessment_date" date,
	"document_id" uuid,
	"photos" jsonb,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "meter_readings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"asset_id" uuid NOT NULL,
	"meter_type" "meter_type" NOT NULL,
	"reading_date" date NOT NULL,
	"reading_value" numeric(15, 2) NOT NULL,
	"previous_value" numeric(15, 2),
	"delta" numeric(15, 2),
	"is_estimated" boolean DEFAULT false,
	"recorded_by" uuid,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "kpi_definitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"code" varchar(30) NOT NULL,
	"name" varchar(200) NOT NULL,
	"description" text,
	"category" "kpi_category" NOT NULL,
	"formula" text,
	"unit" varchar(30),
	"target_value" numeric(15, 4),
	"warning_threshold" numeric(15, 4),
	"critical_threshold" numeric(15, 4),
	"calculation_frequency" varchar(20),
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "kpi_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"kpi_id" uuid NOT NULL,
	"asset_id" uuid,
	"site_id" uuid,
	"calculation_date" timestamp with time zone DEFAULT now(),
	"period_start" timestamp with time zone,
	"period_end" timestamp with time zone,
	"value" numeric(15, 4) NOT NULL,
	"target_value" numeric(15, 4),
	"kpi_status" "kpi_status",
	"kpi_trend" "kpi_trend",
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_assignments" ADD CONSTRAINT "role_assignments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_assignments" ADD CONSTRAINT "role_assignments_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_assignments" ADD CONSTRAINT "role_assignments_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roles" ADD CONSTRAINT "roles_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sso_providers" ADD CONSTRAINT "sso_providers_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sso_user_mappings" ADD CONSTRAINT "sso_user_mappings_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sso_user_mappings" ADD CONSTRAINT "sso_user_mappings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sso_user_mappings" ADD CONSTRAINT "sso_user_mappings_provider_id_sso_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."sso_providers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mfa_tokens" ADD CONSTRAINT "mfa_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mfa_tokens" ADD CONSTRAINT "mfa_tokens_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_asset_type_id_asset_types_id_fk" FOREIGN KEY ("asset_type_id") REFERENCES "public"."asset_types"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_functional_location_id_functional_locations_id_fk" FOREIGN KEY ("functional_location_id") REFERENCES "public"."functional_locations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset_types" ADD CONSTRAINT "asset_types_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset_hierarchy" ADD CONSTRAINT "asset_hierarchy_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset_hierarchy" ADD CONSTRAINT "asset_hierarchy_parent_asset_id_assets_id_fk" FOREIGN KEY ("parent_asset_id") REFERENCES "public"."assets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset_hierarchy" ADD CONSTRAINT "asset_hierarchy_child_asset_id_assets_id_fk" FOREIGN KEY ("child_asset_id") REFERENCES "public"."assets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "functional_locations" ADD CONSTRAINT "functional_locations_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset_attributes" ADD CONSTRAINT "asset_attributes_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset_attributes" ADD CONSTRAINT "asset_attributes_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset_lifecycle_events" ADD CONSTRAINT "asset_lifecycle_events_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset_lifecycle_events" ADD CONSTRAINT "asset_lifecycle_events_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset_lifecycle_events" ADD CONSTRAINT "asset_lifecycle_events_performed_by_users_id_fk" FOREIGN KEY ("performed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset_classifications" ADD CONSTRAINT "asset_classifications_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset_classifications" ADD CONSTRAINT "asset_classifications_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "information_containers" ADD CONSTRAINT "information_containers_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "information_containers" ADD CONSTRAINT "information_containers_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cde_states" ADD CONSTRAINT "cde_states_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cde_states" ADD CONSTRAINT "cde_states_container_id_information_containers_id_fk" FOREIGN KEY ("container_id") REFERENCES "public"."information_containers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cde_states" ADD CONSTRAINT "cde_states_changed_by_users_id_fk" FOREIGN KEY ("changed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cde_workflow_definitions" ADD CONSTRAINT "cde_workflow_definitions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cde_workflow_transitions" ADD CONSTRAINT "cde_workflow_transitions_container_id_information_containers_id_fk" FOREIGN KEY ("container_id") REFERENCES "public"."information_containers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cde_workflow_transitions" ADD CONSTRAINT "cde_workflow_transitions_workflow_id_cde_workflow_definitions_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."cde_workflow_definitions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cde_workflow_transitions" ADD CONSTRAINT "cde_workflow_transitions_triggered_by_users_id_fk" FOREIGN KEY ("triggered_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_registry" ADD CONSTRAINT "document_registry_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_registry" ADD CONSTRAINT "document_registry_container_id_information_containers_id_fk" FOREIGN KEY ("container_id") REFERENCES "public"."information_containers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revision_history" ADD CONSTRAINT "revision_history_container_id_information_containers_id_fk" FOREIGN KEY ("container_id") REFERENCES "public"."information_containers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revision_history" ADD CONSTRAINT "revision_history_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revision_history" ADD CONSTRAINT "revision_history_changed_by_users_id_fk" FOREIGN KEY ("changed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "handover_items" ADD CONSTRAINT "handover_items_package_id_handover_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."handover_packages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "handover_items" ADD CONSTRAINT "handover_items_info_container_id_information_containers_id_fk" FOREIGN KEY ("info_container_id") REFERENCES "public"."information_containers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "handover_items" ADD CONSTRAINT "handover_items_validated_by_users_id_fk" FOREIGN KEY ("validated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "handover_packages" ADD CONSTRAINT "handover_packages_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "handover_packages" ADD CONSTRAINT "handover_packages_submitted_by_users_id_fk" FOREIGN KEY ("submitted_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "handover_packages" ADD CONSTRAINT "handover_packages_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data_quality_issues" ADD CONSTRAINT "data_quality_issues_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data_quality_issues" ADD CONSTRAINT "data_quality_issues_rule_id_data_quality_rules_id_fk" FOREIGN KEY ("rule_id") REFERENCES "public"."data_quality_rules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data_quality_issues" ADD CONSTRAINT "data_quality_issues_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data_quality_rules" ADD CONSTRAINT "data_quality_rules_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data_quality_scores" ADD CONSTRAINT "data_quality_scores_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data_dictionary_entries" ADD CONSTRAINT "data_dictionary_entries_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "digital_twin_instances" ADD CONSTRAINT "digital_twin_instances_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "twin_state_history" ADD CONSTRAINT "twin_state_history_twin_id_digital_twin_instances_id_fk" FOREIGN KEY ("twin_id") REFERENCES "public"."digital_twin_instances"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizational_info_requirements" ADD CONSTRAINT "organizational_info_requirements_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset_info_requirements" ADD CONSTRAINT "asset_info_requirements_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset_info_requirements" ADD CONSTRAINT "asset_info_requirements_oir_id_organizational_info_requirements_id_fk" FOREIGN KEY ("oir_id") REFERENCES "public"."organizational_info_requirements"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exchange_info_requirements" ADD CONSTRAINT "exchange_info_requirements_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exchange_info_requirements" ADD CONSTRAINT "exchange_info_requirements_air_id_asset_info_requirements_id_fk" FOREIGN KEY ("air_id") REFERENCES "public"."asset_info_requirements"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "air_compliance_checks" ADD CONSTRAINT "air_compliance_checks_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "air_compliance_checks" ADD CONSTRAINT "air_compliance_checks_air_id_asset_info_requirements_id_fk" FOREIGN KEY ("air_id") REFERENCES "public"."asset_info_requirements"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "air_compliance_checks" ADD CONSTRAINT "air_compliance_checks_checked_by_users_id_fk" FOREIGN KEY ("checked_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "idp_deliverables" ADD CONSTRAINT "idp_deliverables_plan_id_information_delivery_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."information_delivery_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "idp_deliverables" ADD CONSTRAINT "idp_deliverables_eir_id_exchange_info_requirements_id_fk" FOREIGN KEY ("eir_id") REFERENCES "public"."exchange_info_requirements"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "idp_deliverables" ADD CONSTRAINT "idp_deliverables_container_id_information_containers_id_fk" FOREIGN KEY ("container_id") REFERENCES "public"."information_containers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "information_delivery_plans" ADD CONSTRAINT "information_delivery_plans_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "information_delivery_plans" ADD CONSTRAINT "information_delivery_plans_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loin_definitions" ADD CONSTRAINT "loin_definitions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loin_definitions" ADD CONSTRAINT "loin_definitions_air_id_asset_info_requirements_id_fk" FOREIGN KEY ("air_id") REFERENCES "public"."asset_info_requirements"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_order_approvals" ADD CONSTRAINT "work_order_approvals_work_order_id_work_orders_id_fk" FOREIGN KEY ("work_order_id") REFERENCES "public"."work_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maintenance_tasks" ADD CONSTRAINT "maintenance_tasks_work_order_id_work_orders_id_fk" FOREIGN KEY ("work_order_id") REFERENCES "public"."work_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "spare_parts_usage" ADD CONSTRAINT "spare_parts_usage_work_order_id_work_orders_id_fk" FOREIGN KEY ("work_order_id") REFERENCES "public"."work_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "spare_parts_usage" ADD CONSTRAINT "spare_parts_usage_task_id_maintenance_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."maintenance_tasks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maintenance_history" ADD CONSTRAINT "maintenance_history_work_order_id_work_orders_id_fk" FOREIGN KEY ("work_order_id") REFERENCES "public"."work_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "route_stops" ADD CONSTRAINT "route_stops_route_id_maintenance_routes_id_fk" FOREIGN KEY ("route_id") REFERENCES "public"."maintenance_routes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "route_executions" ADD CONSTRAINT "route_executions_route_id_maintenance_routes_id_fk" FOREIGN KEY ("route_id") REFERENCES "public"."maintenance_routes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "route_stop_readings" ADD CONSTRAINT "route_stop_readings_execution_id_route_executions_id_fk" FOREIGN KEY ("execution_id") REFERENCES "public"."route_executions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "route_stop_readings" ADD CONSTRAINT "route_stop_readings_stop_id_route_stops_id_fk" FOREIGN KEY ("stop_id") REFERENCES "public"."route_stops"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shutdown_scope_items" ADD CONSTRAINT "shutdown_scope_items_shutdown_id_shutdown_events_id_fk" FOREIGN KEY ("shutdown_id") REFERENCES "public"."shutdown_events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shutdown_scope_items" ADD CONSTRAINT "shutdown_scope_items_work_order_id_work_orders_id_fk" FOREIGN KEY ("work_order_id") REFERENCES "public"."work_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "craft_certifications" ADD CONSTRAINT "craft_certifications_craft_id_crafts_id_fk" FOREIGN KEY ("craft_id") REFERENCES "public"."crafts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crew_members" ADD CONSTRAINT "crew_members_crew_id_crews_id_fk" FOREIGN KEY ("crew_id") REFERENCES "public"."crews"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "labor_rates" ADD CONSTRAINT "labor_rates_craft_id_crafts_id_fk" FOREIGN KEY ("craft_id") REFERENCES "public"."crafts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "labor_bookings" ADD CONSTRAINT "labor_bookings_craft_id_crafts_id_fk" FOREIGN KEY ("craft_id") REFERENCES "public"."crafts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "labor_availability" ADD CONSTRAINT "labor_availability_shift_id_shifts_id_fk" FOREIGN KEY ("shift_id") REFERENCES "public"."shifts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_levels" ADD CONSTRAINT "stock_levels_stock_item_id_stock_items_id_fk" FOREIGN KEY ("stock_item_id") REFERENCES "public"."stock_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_levels" ADD CONSTRAINT "stock_levels_storeroom_id_storerooms_id_fk" FOREIGN KEY ("storeroom_id") REFERENCES "public"."storerooms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_transactions" ADD CONSTRAINT "stock_transactions_stock_item_id_stock_items_id_fk" FOREIGN KEY ("stock_item_id") REFERENCES "public"."stock_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_transactions" ADD CONSTRAINT "stock_transactions_storeroom_id_storerooms_id_fk" FOREIGN KEY ("storeroom_id") REFERENCES "public"."storerooms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_transactions" ADD CONSTRAINT "stock_transactions_dest_storeroom_id_storerooms_id_fk" FOREIGN KEY ("dest_storeroom_id") REFERENCES "public"."storerooms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bill_of_materials" ADD CONSTRAINT "bill_of_materials_stock_item_id_stock_items_id_fk" FOREIGN KEY ("stock_item_id") REFERENCES "public"."stock_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cycle_count_items" ADD CONSTRAINT "cycle_count_items_count_id_cycle_counts_id_fk" FOREIGN KEY ("count_id") REFERENCES "public"."cycle_counts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cycle_count_items" ADD CONSTRAINT "cycle_count_items_stock_item_id_stock_items_id_fk" FOREIGN KEY ("stock_item_id") REFERENCES "public"."stock_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cycle_counts" ADD CONSTRAINT "cycle_counts_storeroom_id_storerooms_id_fk" FOREIGN KEY ("storeroom_id") REFERENCES "public"."storerooms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reorder_rules" ADD CONSTRAINT "reorder_rules_stock_item_id_stock_items_id_fk" FOREIGN KEY ("stock_item_id") REFERENCES "public"."stock_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reorder_rules" ADD CONSTRAINT "reorder_rules_storeroom_id_storerooms_id_fk" FOREIGN KEY ("storeroom_id") REFERENCES "public"."storerooms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendors" ADD CONSTRAINT "vendors_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_ratings" ADD CONSTRAINT "vendor_ratings_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_ratings" ADD CONSTRAINT "vendor_ratings_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vendor_ratings" ADD CONSTRAINT "vendor_ratings_rated_by_users_id_fk" FOREIGN KEY ("rated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_requisitions" ADD CONSTRAINT "purchase_requisitions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_requisitions" ADD CONSTRAINT "purchase_requisitions_requested_by_users_id_fk" FOREIGN KEY ("requested_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_requisitions" ADD CONSTRAINT "purchase_requisitions_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_requisition_id_purchase_requisitions_id_fk" FOREIGN KEY ("requisition_id") REFERENCES "public"."purchase_requisitions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "po_line_items" ADD CONSTRAINT "po_line_items_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "po_line_items" ADD CONSTRAINT "po_line_items_purchase_order_id_purchase_orders_id_fk" FOREIGN KEY ("purchase_order_id") REFERENCES "public"."purchase_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goods_receipt_items" ADD CONSTRAINT "goods_receipt_items_receipt_id_goods_receipts_id_fk" FOREIGN KEY ("receipt_id") REFERENCES "public"."goods_receipts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goods_receipt_items" ADD CONSTRAINT "goods_receipt_items_po_line_id_po_line_items_id_fk" FOREIGN KEY ("po_line_id") REFERENCES "public"."po_line_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goods_receipts" ADD CONSTRAINT "goods_receipts_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goods_receipts" ADD CONSTRAINT "goods_receipts_purchase_order_id_purchase_orders_id_fk" FOREIGN KEY ("purchase_order_id") REFERENCES "public"."purchase_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goods_receipts" ADD CONSTRAINT "goods_receipts_received_by_users_id_fk" FOREIGN KEY ("received_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice_matching" ADD CONSTRAINT "invoice_matching_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice_matching" ADD CONSTRAINT "invoice_matching_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice_matching" ADD CONSTRAINT "invoice_matching_purchase_order_id_purchase_orders_id_fk" FOREIGN KEY ("purchase_order_id") REFERENCES "public"."purchase_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice_matching" ADD CONSTRAINT "invoice_matching_matched_by_users_id_fk" FOREIGN KEY ("matched_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "warranty_terms" ADD CONSTRAINT "warranty_terms_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "warranty_coverage" ADD CONSTRAINT "warranty_coverage_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "warranty_coverage" ADD CONSTRAINT "warranty_coverage_warranty_term_id_warranty_terms_id_fk" FOREIGN KEY ("warranty_term_id") REFERENCES "public"."warranty_terms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "warranty_claims" ADD CONSTRAINT "warranty_claims_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "warranty_claims" ADD CONSTRAINT "warranty_claims_coverage_id_warranty_coverage_id_fk" FOREIGN KEY ("coverage_id") REFERENCES "public"."warranty_coverage"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sla_definitions" ADD CONSTRAINT "sla_definitions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sla_targets" ADD CONSTRAINT "sla_targets_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sla_targets" ADD CONSTRAINT "sla_targets_sla_id_sla_definitions_id_fk" FOREIGN KEY ("sla_id") REFERENCES "public"."sla_definitions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sla_tracking" ADD CONSTRAINT "sla_tracking_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sla_tracking" ADD CONSTRAINT "sla_tracking_sla_target_id_sla_targets_id_fk" FOREIGN KEY ("sla_target_id") REFERENCES "public"."sla_targets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sla_breaches" ADD CONSTRAINT "sla_breaches_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sla_breaches" ADD CONSTRAINT "sla_breaches_tracking_id_sla_tracking_id_fk" FOREIGN KEY ("tracking_id") REFERENCES "public"."sla_tracking"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contractors" ADD CONSTRAINT "contractors_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_contractor_id_contractors_id_fk" FOREIGN KEY ("contractor_id") REFERENCES "public"."contractors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contract_line_items" ADD CONSTRAINT "contract_line_items_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contract_line_items" ADD CONSTRAINT "contract_line_items_contract_id_contracts_id_fk" FOREIGN KEY ("contract_id") REFERENCES "public"."contracts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contractor_personnel" ADD CONSTRAINT "contractor_personnel_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contractor_personnel" ADD CONSTRAINT "contractor_personnel_contractor_id_contractors_id_fk" FOREIGN KEY ("contractor_id") REFERENCES "public"."contractors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contractor_safety_records" ADD CONSTRAINT "contractor_safety_records_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contractor_safety_records" ADD CONSTRAINT "contractor_safety_records_contractor_id_contractors_id_fk" FOREIGN KEY ("contractor_id") REFERENCES "public"."contractors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contractor_safety_records" ADD CONSTRAINT "contractor_safety_records_personnel_id_contractor_personnel_id_fk" FOREIGN KEY ("personnel_id") REFERENCES "public"."contractor_personnel"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_permits" ADD CONSTRAINT "work_permits_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "permit_types" ADD CONSTRAINT "permit_types_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "isolation_points" ADD CONSTRAINT "isolation_points_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loto_applications" ADD CONSTRAINT "loto_applications_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loto_applications" ADD CONSTRAINT "loto_applications_procedure_id_loto_procedures_id_fk" FOREIGN KEY ("procedure_id") REFERENCES "public"."loto_procedures"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loto_procedures" ADD CONSTRAINT "loto_procedures_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "safety_observations" ADD CONSTRAINT "safety_observations_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cost_centers" ADD CONSTRAINT "cost_centers_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cost_centers" ADD CONSTRAINT "cost_centers_manager_id_users_id_fk" FOREIGN KEY ("manager_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_cost_center_id_cost_centers_id_fk" FOREIGN KEY ("cost_center_id") REFERENCES "public"."cost_centers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "budget_line_items" ADD CONSTRAINT "budget_line_items_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "budget_line_items" ADD CONSTRAINT "budget_line_items_budget_id_budgets_id_fk" FOREIGN KEY ("budget_id") REFERENCES "public"."budgets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cost_transactions" ADD CONSTRAINT "cost_transactions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cost_transactions" ADD CONSTRAINT "cost_transactions_cost_center_id_cost_centers_id_fk" FOREIGN KEY ("cost_center_id") REFERENCES "public"."cost_centers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cost_transactions" ADD CONSTRAINT "cost_transactions_budget_id_budgets_id_fk" FOREIGN KEY ("budget_id") REFERENCES "public"."budgets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cost_transactions" ADD CONSTRAINT "cost_transactions_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "depreciation_profiles" ADD CONSTRAINT "depreciation_profiles_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "depreciation_profiles" ADD CONSTRAINT "depreciation_profiles_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "depreciation_profiles" ADD CONSTRAINT "depreciation_profiles_asset_type_id_asset_types_id_fk" FOREIGN KEY ("asset_type_id") REFERENCES "public"."asset_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "depreciation_schedule" ADD CONSTRAINT "depreciation_schedule_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "depreciation_schedule" ADD CONSTRAINT "depreciation_schedule_profile_id_depreciation_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."depreciation_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "depreciation_schedule" ADD CONSTRAINT "depreciation_schedule_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset_valuations" ADD CONSTRAINT "asset_valuations_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset_valuations" ADD CONSTRAINT "asset_valuations_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset_valuations" ADD CONSTRAINT "asset_valuations_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset_cost_rollup" ADD CONSTRAINT "asset_cost_rollup_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset_cost_rollup" ADD CONSTRAINT "asset_cost_rollup_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "replacement_analyses" ADD CONSTRAINT "replacement_analyses_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "replacement_analyses" ADD CONSTRAINT "replacement_analyses_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "replacement_analyses" ADD CONSTRAINT "replacement_analyses_performed_by_users_id_fk" FOREIGN KEY ("performed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "replacement_analyses" ADD CONSTRAINT "replacement_analyses_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "capital_projects" ADD CONSTRAINT "capital_projects_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "capital_projects" ADD CONSTRAINT "capital_projects_project_manager_id_users_id_fk" FOREIGN KEY ("project_manager_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_phases" ADD CONSTRAINT "project_phases_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_phases" ADD CONSTRAINT "project_phases_project_id_capital_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."capital_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_tasks" ADD CONSTRAINT "project_tasks_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_tasks" ADD CONSTRAINT "project_tasks_phase_id_project_phases_id_fk" FOREIGN KEY ("phase_id") REFERENCES "public"."project_phases"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_tasks" ADD CONSTRAINT "project_tasks_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "management_of_change" ADD CONSTRAINT "management_of_change_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "management_of_change" ADD CONSTRAINT "management_of_change_requested_by_users_id_fk" FOREIGN KEY ("requested_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moc_approvals" ADD CONSTRAINT "moc_approvals_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moc_approvals" ADD CONSTRAINT "moc_approvals_moc_id_management_of_change_id_fk" FOREIGN KEY ("moc_id") REFERENCES "public"."management_of_change"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moc_approvals" ADD CONSTRAINT "moc_approvals_approver_id_users_id_fk" FOREIGN KEY ("approver_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_requested_by_users_id_fk" FOREIGN KEY ("requested_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "request_categories" ADD CONSTRAINT "request_categories_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "request_comments" ADD CONSTRAINT "request_comments_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "request_comments" ADD CONSTRAINT "request_comments_service_request_id_service_requests_id_fk" FOREIGN KEY ("service_request_id") REFERENCES "public"."service_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "request_comments" ADD CONSTRAINT "request_comments_comment_by_users_id_fk" FOREIGN KEY ("comment_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset_functions" ADD CONSTRAINT "asset_functions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "functional_failures" ADD CONSTRAINT "functional_failures_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "functional_failures" ADD CONSTRAINT "functional_failures_function_id_asset_functions_id_fk" FOREIGN KEY ("function_id") REFERENCES "public"."asset_functions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "failure_modes" ADD CONSTRAINT "failure_modes_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "failure_modes" ADD CONSTRAINT "failure_modes_functional_failure_id_functional_failures_id_fk" FOREIGN KEY ("functional_failure_id") REFERENCES "public"."functional_failures"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fmea_analyses" ADD CONSTRAINT "fmea_analyses_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fmea_worksheets" ADD CONSTRAINT "fmea_worksheets_analysis_id_fmea_analyses_id_fk" FOREIGN KEY ("analysis_id") REFERENCES "public"."fmea_analyses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fmea_worksheets" ADD CONSTRAINT "fmea_worksheets_failure_mode_id_failure_modes_id_fk" FOREIGN KEY ("failure_mode_id") REFERENCES "public"."failure_modes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "failure_events" ADD CONSTRAINT "failure_events_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "failure_events" ADD CONSTRAINT "failure_events_failure_mode_id_failure_modes_id_fk" FOREIGN KEY ("failure_mode_id") REFERENCES "public"."failure_modes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rcm_decisions" ADD CONSTRAINT "rcm_decisions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rcm_decisions" ADD CONSTRAINT "rcm_decisions_failure_mode_id_failure_modes_id_fk" FOREIGN KEY ("failure_mode_id") REFERENCES "public"."failure_modes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "criticality_analyses" ADD CONSTRAINT "criticality_analyses_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reliability_metrics" ADD CONSTRAINT "reliability_metrics_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reliability_metrics" ADD CONSTRAINT "reliability_metrics_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "root_cause_analyses" ADD CONSTRAINT "root_cause_analyses_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "root_cause_analyses" ADD CONSTRAINT "root_cause_analyses_led_by_users_id_fk" FOREIGN KEY ("led_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rca_contributing_factors" ADD CONSTRAINT "rca_contributing_factors_rca_id_root_cause_analyses_id_fk" FOREIGN KEY ("rca_id") REFERENCES "public"."root_cause_analyses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pf_curve_definitions" ADD CONSTRAINT "pf_curve_definitions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weibull_analyses" ADD CONSTRAINT "weibull_analyses_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weibull_analyses" ADD CONSTRAINT "weibull_analyses_performed_by_users_id_fk" FOREIGN KEY ("performed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ram_analyses" ADD CONSTRAINT "ram_analyses_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ram_analyses" ADD CONSTRAINT "ram_analyses_system_asset_id_assets_id_fk" FOREIGN KEY ("system_asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ram_analyses" ADD CONSTRAINT "ram_analyses_bottleneck_asset_id_assets_id_fk" FOREIGN KEY ("bottleneck_asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ram_analyses" ADD CONSTRAINT "ram_analyses_performed_by_users_id_fk" FOREIGN KEY ("performed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ram_component_data" ADD CONSTRAINT "ram_component_data_ram_analysis_id_ram_analyses_id_fk" FOREIGN KEY ("ram_analysis_id") REFERENCES "public"."ram_analyses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ram_component_data" ADD CONSTRAINT "ram_component_data_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_package_items" ADD CONSTRAINT "task_package_items_package_id_task_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."task_packages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_packages" ADD CONSTRAINT "task_packages_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uniclass_codes" ADD CONSTRAINT "uniclass_codes_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "iso14224_taxonomy" ADD CONSTRAINT "iso14224_taxonomy_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "failure_codes" ADD CONSTRAINT "failure_codes_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cause_codes" ADD CONSTRAINT "cause_codes_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sensor_registry" ADD CONSTRAINT "sensor_registry_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sensor_registry" ADD CONSTRAINT "sensor_registry_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "telemetry_events" ADD CONSTRAINT "telemetry_events_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "telemetry_events" ADD CONSTRAINT "telemetry_events_sensor_id_sensor_registry_id_fk" FOREIGN KEY ("sensor_id") REFERENCES "public"."sensor_registry"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "telemetry_events" ADD CONSTRAINT "telemetry_events_acknowledged_by_users_id_fk" FOREIGN KEY ("acknowledged_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alert_rules" ADD CONSTRAINT "alert_rules_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alert_rules" ADD CONSTRAINT "alert_rules_sensor_id_sensor_registry_id_fk" FOREIGN KEY ("sensor_id") REFERENCES "public"."sensor_registry"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alert_history" ADD CONSTRAINT "alert_history_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alert_history" ADD CONSTRAINT "alert_history_alert_rule_id_alert_rules_id_fk" FOREIGN KEY ("alert_rule_id") REFERENCES "public"."alert_rules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alert_history" ADD CONSTRAINT "alert_history_sensor_id_sensor_registry_id_fk" FOREIGN KEY ("sensor_id") REFERENCES "public"."sensor_registry"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alert_history" ADD CONSTRAINT "alert_history_acknowledged_by_users_id_fk" FOREIGN KEY ("acknowledged_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ifc_models" ADD CONSTRAINT "ifc_models_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ifc_models" ADD CONSTRAINT "ifc_models_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ifc_elements" ADD CONSTRAINT "ifc_elements_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ifc_elements" ADD CONSTRAINT "ifc_elements_model_id_ifc_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."ifc_models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "element_asset_links" ADD CONSTRAINT "element_asset_links_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "element_asset_links" ADD CONSTRAINT "element_asset_links_ifc_element_id_ifc_elements_id_fk" FOREIGN KEY ("ifc_element_id") REFERENCES "public"."ifc_elements"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "element_asset_links" ADD CONSTRAINT "element_asset_links_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "element_asset_links" ADD CONSTRAINT "element_asset_links_linked_by_users_id_fk" FOREIGN KEY ("linked_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "model_versions" ADD CONSTRAINT "model_versions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "model_versions" ADD CONSTRAINT "model_versions_model_id_ifc_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."ifc_models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "model_versions" ADD CONSTRAINT "model_versions_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "regulations" ADD CONSTRAINT "regulations_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compliance_requirements" ADD CONSTRAINT "compliance_requirements_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compliance_requirements" ADD CONSTRAINT "compliance_requirements_regulation_id_regulations_id_fk" FOREIGN KEY ("regulation_id") REFERENCES "public"."regulations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "requirement_asset_map" ADD CONSTRAINT "requirement_asset_map_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "requirement_asset_map" ADD CONSTRAINT "requirement_asset_map_requirement_id_compliance_requirements_id_fk" FOREIGN KEY ("requirement_id") REFERENCES "public"."compliance_requirements"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "requirement_asset_map" ADD CONSTRAINT "requirement_asset_map_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inspections" ADD CONSTRAINT "inspections_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inspections" ADD CONSTRAINT "inspections_requirement_id_compliance_requirements_id_fk" FOREIGN KEY ("requirement_id") REFERENCES "public"."compliance_requirements"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inspections" ADD CONSTRAINT "inspections_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inspections" ADD CONSTRAINT "inspections_inspector_id_users_id_fk" FOREIGN KEY ("inspector_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "violations" ADD CONSTRAINT "violations_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "violations" ADD CONSTRAINT "violations_inspection_id_inspections_id_fk" FOREIGN KEY ("inspection_id") REFERENCES "public"."inspections"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "violations" ADD CONSTRAINT "violations_regulation_id_regulations_id_fk" FOREIGN KEY ("regulation_id") REFERENCES "public"."regulations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "violations" ADD CONSTRAINT "violations_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "corrective_actions" ADD CONSTRAINT "corrective_actions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "corrective_actions" ADD CONSTRAINT "corrective_actions_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "corrective_actions" ADD CONSTRAINT "corrective_actions_verified_by_users_id_fk" FOREIGN KEY ("verified_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_reports" ADD CONSTRAINT "audit_reports_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "condition_assessments" ADD CONSTRAINT "condition_assessments_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "condition_assessments" ADD CONSTRAINT "condition_assessments_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "condition_assessments" ADD CONSTRAINT "condition_assessments_assessor_id_users_id_fk" FOREIGN KEY ("assessor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meter_readings" ADD CONSTRAINT "meter_readings_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meter_readings" ADD CONSTRAINT "meter_readings_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meter_readings" ADD CONSTRAINT "meter_readings_recorded_by_users_id_fk" FOREIGN KEY ("recorded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kpi_definitions" ADD CONSTRAINT "kpi_definitions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kpi_results" ADD CONSTRAINT "kpi_results_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kpi_results" ADD CONSTRAINT "kpi_results_kpi_id_kpi_definitions_id_fk" FOREIGN KEY ("kpi_id") REFERENCES "public"."kpi_definitions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kpi_results" ADD CONSTRAINT "kpi_results_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "tenants_slug_idx" ON "tenants" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "tenants_domain_idx" ON "tenants" USING btree ("domain");--> statement-breakpoint
CREATE INDEX "tenants_is_active_idx" ON "tenants" USING btree ("is_active");--> statement-breakpoint
CREATE UNIQUE INDEX "users_tenant_email_idx" ON "users" USING btree ("tenant_id","email");--> statement-breakpoint
CREATE INDEX "users_tenant_id_idx" ON "users" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "users_role_idx" ON "users" USING btree ("tenant_id","role");--> statement-breakpoint
CREATE INDEX "users_is_active_idx" ON "users" USING btree ("tenant_id","is_active");--> statement-breakpoint
CREATE INDEX "role_assignments_tenant_id_idx" ON "role_assignments" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "role_assignments_user_id_idx" ON "role_assignments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "role_assignments_role_id_idx" ON "role_assignments" USING btree ("role_id");--> statement-breakpoint
CREATE UNIQUE INDEX "roles_tenant_name_idx" ON "roles" USING btree ("tenant_id","name");--> statement-breakpoint
CREATE INDEX "roles_tenant_id_idx" ON "roles" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "audit_log_tenant_id_idx" ON "audit_log" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "audit_log_tenant_entity_idx" ON "audit_log" USING btree ("tenant_id","entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "audit_log_tenant_user_idx" ON "audit_log" USING btree ("tenant_id","user_id");--> statement-breakpoint
CREATE INDEX "audit_log_tenant_action_idx" ON "audit_log" USING btree ("tenant_id","action");--> statement-breakpoint
CREATE INDEX "audit_log_created_at_idx" ON "audit_log" USING btree ("tenant_id","created_at");--> statement-breakpoint
CREATE INDEX "sessions_user_id_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "sessions_tenant_id_idx" ON "sessions" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "sessions_token_idx" ON "sessions" USING btree ("token");--> statement-breakpoint
CREATE INDEX "sessions_expires_at_idx" ON "sessions" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "sso_providers_tenant_id_idx" ON "sso_providers" USING btree ("tenant_id");--> statement-breakpoint
CREATE UNIQUE INDEX "sso_providers_tenant_name_idx" ON "sso_providers" USING btree ("tenant_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX "sso_user_mappings_provider_external_idx" ON "sso_user_mappings" USING btree ("provider_id","external_user_id");--> statement-breakpoint
CREATE INDEX "sso_user_mappings_user_id_idx" ON "sso_user_mappings" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "sso_user_mappings_tenant_id_idx" ON "sso_user_mappings" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "api_keys_tenant_id_idx" ON "api_keys" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "api_keys_key_prefix_idx" ON "api_keys" USING btree ("key_prefix");--> statement-breakpoint
CREATE INDEX "api_keys_is_active_idx" ON "api_keys" USING btree ("tenant_id","is_active");--> statement-breakpoint
CREATE UNIQUE INDEX "mfa_tokens_user_method_idx" ON "mfa_tokens" USING btree ("user_id","method");--> statement-breakpoint
CREATE INDEX "mfa_tokens_user_id_idx" ON "mfa_tokens" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "mfa_tokens_tenant_id_idx" ON "mfa_tokens" USING btree ("tenant_id");--> statement-breakpoint
CREATE UNIQUE INDEX "assets_tenant_tag_idx" ON "assets" USING btree ("tenant_id","tag_number");--> statement-breakpoint
CREATE INDEX "assets_tenant_id_idx" ON "assets" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "assets_tenant_status_idx" ON "assets" USING btree ("tenant_id","status");--> statement-breakpoint
CREATE INDEX "assets_tenant_criticality_idx" ON "assets" USING btree ("tenant_id","criticality");--> statement-breakpoint
CREATE INDEX "assets_asset_type_id_idx" ON "assets" USING btree ("asset_type_id");--> statement-breakpoint
CREATE INDEX "assets_parent_asset_id_idx" ON "assets" USING btree ("parent_asset_id");--> statement-breakpoint
CREATE INDEX "assets_functional_location_id_idx" ON "assets" USING btree ("functional_location_id");--> statement-breakpoint
CREATE INDEX "assets_serial_number_idx" ON "assets" USING btree ("tenant_id","serial_number");--> statement-breakpoint
CREATE INDEX "assets_manufacturer_idx" ON "assets" USING btree ("tenant_id","manufacturer");--> statement-breakpoint
CREATE UNIQUE INDEX "asset_types_tenant_code_idx" ON "asset_types" USING btree ("tenant_id","code");--> statement-breakpoint
CREATE INDEX "asset_types_tenant_id_idx" ON "asset_types" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "asset_types_parent_type_id_idx" ON "asset_types" USING btree ("parent_type_id");--> statement-breakpoint
CREATE INDEX "asset_types_category_idx" ON "asset_types" USING btree ("tenant_id","category");--> statement-breakpoint
CREATE INDEX "asset_types_is_active_idx" ON "asset_types" USING btree ("tenant_id","is_active");--> statement-breakpoint
CREATE UNIQUE INDEX "asset_hierarchy_parent_child_type_idx" ON "asset_hierarchy" USING btree ("parent_asset_id","child_asset_id","relationship_type");--> statement-breakpoint
CREATE INDEX "asset_hierarchy_tenant_id_idx" ON "asset_hierarchy" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "asset_hierarchy_parent_asset_id_idx" ON "asset_hierarchy" USING btree ("parent_asset_id");--> statement-breakpoint
CREATE INDEX "asset_hierarchy_child_asset_id_idx" ON "asset_hierarchy" USING btree ("child_asset_id");--> statement-breakpoint
CREATE UNIQUE INDEX "functional_locations_tenant_code_idx" ON "functional_locations" USING btree ("tenant_id","code");--> statement-breakpoint
CREATE INDEX "functional_locations_tenant_id_idx" ON "functional_locations" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "functional_locations_parent_id_idx" ON "functional_locations" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "functional_locations_location_type_idx" ON "functional_locations" USING btree ("tenant_id","location_type");--> statement-breakpoint
CREATE INDEX "functional_locations_is_active_idx" ON "functional_locations" USING btree ("tenant_id","is_active");--> statement-breakpoint
CREATE INDEX "asset_attributes_tenant_id_idx" ON "asset_attributes" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "asset_attributes_asset_id_idx" ON "asset_attributes" USING btree ("asset_id");--> statement-breakpoint
CREATE INDEX "asset_attributes_asset_attr_name_idx" ON "asset_attributes" USING btree ("asset_id","attribute_name");--> statement-breakpoint
CREATE INDEX "asset_lifecycle_tenant_id_idx" ON "asset_lifecycle_events" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "asset_lifecycle_asset_id_idx" ON "asset_lifecycle_events" USING btree ("asset_id");--> statement-breakpoint
CREATE INDEX "asset_lifecycle_event_type_idx" ON "asset_lifecycle_events" USING btree ("tenant_id","event_type");--> statement-breakpoint
CREATE INDEX "asset_lifecycle_event_date_idx" ON "asset_lifecycle_events" USING btree ("tenant_id","event_date");--> statement-breakpoint
CREATE UNIQUE INDEX "asset_class_asset_system_idx" ON "asset_classifications" USING btree ("asset_id","classification_system");--> statement-breakpoint
CREATE INDEX "asset_classifications_tenant_id_idx" ON "asset_classifications" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "asset_classifications_asset_id_idx" ON "asset_classifications" USING btree ("asset_id");--> statement-breakpoint
CREATE INDEX "asset_classifications_system_code_idx" ON "asset_classifications" USING btree ("tenant_id","classification_system","class_code");--> statement-breakpoint
CREATE UNIQUE INDEX "info_containers_tenant_code_idx" ON "information_containers" USING btree ("tenant_id","container_code");--> statement-breakpoint
CREATE INDEX "info_containers_tenant_id_idx" ON "information_containers" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "info_containers_type_idx" ON "information_containers" USING btree ("tenant_id","container_type");--> statement-breakpoint
CREATE INDEX "info_containers_status_idx" ON "information_containers" USING btree ("tenant_id","status");--> statement-breakpoint
CREATE INDEX "info_containers_cde_state_idx" ON "information_containers" USING btree ("cde_state_id");--> statement-breakpoint
CREATE INDEX "info_containers_created_by_idx" ON "information_containers" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "cde_states_tenant_id_idx" ON "cde_states" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "cde_states_container_id_idx" ON "cde_states" USING btree ("container_id");--> statement-breakpoint
CREATE INDEX "cde_states_state_idx" ON "cde_states" USING btree ("tenant_id","state");--> statement-breakpoint
CREATE INDEX "cde_states_changed_at_idx" ON "cde_states" USING btree ("container_id","changed_at");--> statement-breakpoint
CREATE INDEX "cde_states_changed_by_idx" ON "cde_states" USING btree ("changed_by");--> statement-breakpoint
CREATE INDEX "cde_wf_defs_tenant_id_idx" ON "cde_workflow_definitions" USING btree ("tenant_id");--> statement-breakpoint
CREATE UNIQUE INDEX "cde_wf_defs_tenant_name_idx" ON "cde_workflow_definitions" USING btree ("tenant_id","name");--> statement-breakpoint
CREATE INDEX "cde_wf_defs_from_state_idx" ON "cde_workflow_definitions" USING btree ("tenant_id","from_state");--> statement-breakpoint
CREATE INDEX "cde_wf_defs_to_state_idx" ON "cde_workflow_definitions" USING btree ("tenant_id","to_state");--> statement-breakpoint
CREATE INDEX "cde_wf_trans_container_id_idx" ON "cde_workflow_transitions" USING btree ("container_id");--> statement-breakpoint
CREATE INDEX "cde_wf_trans_workflow_id_idx" ON "cde_workflow_transitions" USING btree ("workflow_id");--> statement-breakpoint
CREATE INDEX "cde_wf_trans_transitioned_at_idx" ON "cde_workflow_transitions" USING btree ("container_id","transitioned_at");--> statement-breakpoint
CREATE INDEX "cde_wf_trans_triggered_by_idx" ON "cde_workflow_transitions" USING btree ("triggered_by");--> statement-breakpoint
CREATE UNIQUE INDEX "doc_reg_tenant_doc_number_idx" ON "document_registry" USING btree ("tenant_id","document_number");--> statement-breakpoint
CREATE INDEX "doc_reg_tenant_id_idx" ON "document_registry" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "doc_reg_container_id_idx" ON "document_registry" USING btree ("container_id");--> statement-breakpoint
CREATE INDEX "doc_reg_asset_id_idx" ON "document_registry" USING btree ("asset_id");--> statement-breakpoint
CREATE INDEX "doc_reg_doc_type_idx" ON "document_registry" USING btree ("tenant_id","document_type");--> statement-breakpoint
CREATE INDEX "doc_reg_discipline_idx" ON "document_registry" USING btree ("tenant_id","discipline");--> statement-breakpoint
CREATE INDEX "rev_history_tenant_id_idx" ON "revision_history" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "rev_history_container_id_idx" ON "revision_history" USING btree ("container_id");--> statement-breakpoint
CREATE INDEX "rev_history_revision_date_idx" ON "revision_history" USING btree ("container_id","revision_date");--> statement-breakpoint
CREATE INDEX "rev_history_change_type_idx" ON "revision_history" USING btree ("tenant_id","change_type");--> statement-breakpoint
CREATE INDEX "rev_history_prev_version_idx" ON "revision_history" USING btree ("previous_version_id");--> statement-breakpoint
CREATE INDEX "handover_items_package_id_idx" ON "handover_items" USING btree ("package_id");--> statement-breakpoint
CREATE INDEX "handover_items_asset_id_idx" ON "handover_items" USING btree ("asset_id");--> statement-breakpoint
CREATE INDEX "handover_items_container_id_idx" ON "handover_items" USING btree ("info_container_id");--> statement-breakpoint
CREATE INDEX "handover_items_air_req_id_idx" ON "handover_items" USING btree ("air_requirement_id");--> statement-breakpoint
CREATE INDEX "handover_items_status_idx" ON "handover_items" USING btree ("package_id","status");--> statement-breakpoint
CREATE INDEX "handover_pkg_tenant_id_idx" ON "handover_packages" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "handover_pkg_project_id_idx" ON "handover_packages" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "handover_pkg_status_idx" ON "handover_packages" USING btree ("tenant_id","status");--> statement-breakpoint
CREATE INDEX "handover_pkg_type_idx" ON "handover_packages" USING btree ("tenant_id","type");--> statement-breakpoint
CREATE INDEX "handover_pkg_submitted_by_idx" ON "handover_packages" USING btree ("submitted_by");--> statement-breakpoint
CREATE INDEX "dq_issues_tenant_id_idx" ON "data_quality_issues" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "dq_issues_rule_id_idx" ON "data_quality_issues" USING btree ("rule_id");--> statement-breakpoint
CREATE INDEX "dq_issues_record_idx" ON "data_quality_issues" USING btree ("record_table","record_id");--> statement-breakpoint
CREATE INDEX "dq_issues_status_idx" ON "data_quality_issues" USING btree ("tenant_id","status");--> statement-breakpoint
CREATE INDEX "dq_issues_assigned_to_idx" ON "data_quality_issues" USING btree ("assigned_to");--> statement-breakpoint
CREATE INDEX "dq_issues_detected_at_idx" ON "data_quality_issues" USING btree ("tenant_id","detected_at");--> statement-breakpoint
CREATE INDEX "dq_rules_tenant_id_idx" ON "data_quality_rules" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "dq_rules_target_table_idx" ON "data_quality_rules" USING btree ("tenant_id","target_table");--> statement-breakpoint
CREATE INDEX "dq_rules_rule_type_idx" ON "data_quality_rules" USING btree ("tenant_id","rule_type");--> statement-breakpoint
CREATE INDEX "dq_rules_is_active_idx" ON "data_quality_rules" USING btree ("tenant_id","is_active");--> statement-breakpoint
CREATE INDEX "dq_scores_tenant_id_idx" ON "data_quality_scores" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "dq_scores_scan_date_idx" ON "data_quality_scores" USING btree ("tenant_id","scan_date");--> statement-breakpoint
CREATE INDEX "dq_scores_target_table_idx" ON "data_quality_scores" USING btree ("tenant_id","target_table");--> statement-breakpoint
CREATE UNIQUE INDEX "data_dict_tenant_prop_name_idx" ON "data_dictionary_entries" USING btree ("tenant_id","property_name");--> statement-breakpoint
CREATE INDEX "data_dict_tenant_id_idx" ON "data_dictionary_entries" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "data_dict_data_type_idx" ON "data_dictionary_entries" USING btree ("tenant_id","data_type");--> statement-breakpoint
CREATE INDEX "data_dict_property_set_idx" ON "data_dictionary_entries" USING btree ("tenant_id","property_set");--> statement-breakpoint
CREATE INDEX "data_dict_source_standard_idx" ON "data_dictionary_entries" USING btree ("tenant_id","source_standard");--> statement-breakpoint
CREATE INDEX "data_dict_is_active_idx" ON "data_dictionary_entries" USING btree ("tenant_id","is_active");--> statement-breakpoint
CREATE INDEX "dt_instances_tenant_id_idx" ON "digital_twin_instances" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "dt_instances_asset_id_idx" ON "digital_twin_instances" USING btree ("asset_id");--> statement-breakpoint
CREATE INDEX "dt_instances_ifc_element_idx" ON "digital_twin_instances" USING btree ("ifc_element_id");--> statement-breakpoint
CREATE INDEX "dt_instances_twin_status_idx" ON "digital_twin_instances" USING btree ("tenant_id","twin_status");--> statement-breakpoint
CREATE INDEX "dt_instances_last_sync_idx" ON "digital_twin_instances" USING btree ("last_sync_at");--> statement-breakpoint
CREATE INDEX "twin_state_hist_twin_id_idx" ON "twin_state_history" USING btree ("twin_id");--> statement-breakpoint
CREATE INDEX "twin_state_hist_time_idx" ON "twin_state_history" USING btree ("time");--> statement-breakpoint
CREATE UNIQUE INDEX "oir_tenant_code_idx" ON "organizational_info_requirements" USING btree ("tenant_id","code");--> statement-breakpoint
CREATE INDEX "oir_tenant_id_idx" ON "organizational_info_requirements" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "oir_category_idx" ON "organizational_info_requirements" USING btree ("tenant_id","category");--> statement-breakpoint
CREATE INDEX "oir_priority_idx" ON "organizational_info_requirements" USING btree ("tenant_id","priority");--> statement-breakpoint
CREATE INDEX "oir_lifecycle_stage_idx" ON "organizational_info_requirements" USING btree ("tenant_id","lifecycle_stage");--> statement-breakpoint
CREATE INDEX "oir_is_active_idx" ON "organizational_info_requirements" USING btree ("tenant_id","is_active");--> statement-breakpoint
CREATE UNIQUE INDEX "air_tenant_oir_field_idx" ON "asset_info_requirements" USING btree ("tenant_id","oir_id","data_field");--> statement-breakpoint
CREATE INDEX "air_tenant_id_idx" ON "asset_info_requirements" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "air_oir_id_idx" ON "asset_info_requirements" USING btree ("oir_id");--> statement-breakpoint
CREATE INDEX "air_asset_type_id_idx" ON "asset_info_requirements" USING btree ("asset_type_id");--> statement-breakpoint
CREATE INDEX "air_lifecycle_stage_idx" ON "asset_info_requirements" USING btree ("tenant_id","lifecycle_stage");--> statement-breakpoint
CREATE INDEX "air_is_mandatory_idx" ON "asset_info_requirements" USING btree ("tenant_id","is_mandatory");--> statement-breakpoint
CREATE INDEX "eir_tenant_id_idx" ON "exchange_info_requirements" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "eir_air_id_idx" ON "exchange_info_requirements" USING btree ("air_id");--> statement-breakpoint
CREATE INDEX "eir_status_idx" ON "exchange_info_requirements" USING btree ("tenant_id","status");--> statement-breakpoint
CREATE INDEX "eir_due_date_idx" ON "exchange_info_requirements" USING btree ("tenant_id","due_date");--> statement-breakpoint
CREATE INDEX "eir_responsible_party_idx" ON "exchange_info_requirements" USING btree ("tenant_id","responsible_party");--> statement-breakpoint
CREATE INDEX "air_compliance_tenant_id_idx" ON "air_compliance_checks" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "air_compliance_asset_id_idx" ON "air_compliance_checks" USING btree ("asset_id");--> statement-breakpoint
CREATE INDEX "air_compliance_air_id_idx" ON "air_compliance_checks" USING btree ("air_id");--> statement-breakpoint
CREATE INDEX "air_compliance_check_date_idx" ON "air_compliance_checks" USING btree ("tenant_id","check_date");--> statement-breakpoint
CREATE INDEX "air_compliance_is_passing_idx" ON "air_compliance_checks" USING btree ("tenant_id","is_passing");--> statement-breakpoint
CREATE INDEX "air_compliance_checked_by_idx" ON "air_compliance_checks" USING btree ("checked_by");--> statement-breakpoint
CREATE INDEX "idp_deliv_plan_id_idx" ON "idp_deliverables" USING btree ("plan_id");--> statement-breakpoint
CREATE INDEX "idp_deliv_eir_id_idx" ON "idp_deliverables" USING btree ("eir_id");--> statement-breakpoint
CREATE INDEX "idp_deliv_container_id_idx" ON "idp_deliverables" USING btree ("container_id");--> statement-breakpoint
CREATE INDEX "idp_deliv_status_idx" ON "idp_deliverables" USING btree ("plan_id","status");--> statement-breakpoint
CREATE INDEX "idp_deliv_due_date_idx" ON "idp_deliverables" USING btree ("due_date");--> statement-breakpoint
CREATE INDEX "idp_tenant_id_idx" ON "information_delivery_plans" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idp_project_id_idx" ON "information_delivery_plans" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "idp_type_idx" ON "information_delivery_plans" USING btree ("tenant_id","type");--> statement-breakpoint
CREATE INDEX "idp_status_idx" ON "information_delivery_plans" USING btree ("tenant_id","status");--> statement-breakpoint
CREATE INDEX "idp_created_by_idx" ON "information_delivery_plans" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "loin_tenant_id_idx" ON "loin_definitions" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "loin_air_id_idx" ON "loin_definitions" USING btree ("air_id");--> statement-breakpoint
CREATE INDEX "loin_asset_type_id_idx" ON "loin_definitions" USING btree ("asset_type_id");--> statement-breakpoint
CREATE INDEX "loin_lifecycle_stage_idx" ON "loin_definitions" USING btree ("tenant_id","lifecycle_stage");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_work_orders_tenant_wo_number" ON "work_orders" USING btree ("tenant_id","wo_number");--> statement-breakpoint
CREATE INDEX "idx_work_orders_tenant_status" ON "work_orders" USING btree ("tenant_id","status");--> statement-breakpoint
CREATE INDEX "idx_work_orders_tenant_asset" ON "work_orders" USING btree ("tenant_id","asset_id");--> statement-breakpoint
CREATE INDEX "idx_work_orders_tenant_type" ON "work_orders" USING btree ("tenant_id","type");--> statement-breakpoint
CREATE INDEX "idx_work_orders_tenant_priority" ON "work_orders" USING btree ("tenant_id","priority");--> statement-breakpoint
CREATE INDEX "idx_work_orders_assigned_to" ON "work_orders" USING btree ("tenant_id","assigned_to");--> statement-breakpoint
CREATE INDEX "idx_work_orders_crew" ON "work_orders" USING btree ("tenant_id","crew_id");--> statement-breakpoint
CREATE INDEX "idx_work_orders_scheduled_start" ON "work_orders" USING btree ("tenant_id","scheduled_start");--> statement-breakpoint
CREATE INDEX "idx_work_orders_parent" ON "work_orders" USING btree ("parent_wo_id");--> statement-breakpoint
CREATE INDEX "idx_wo_approvals_tenant_wo" ON "work_order_approvals" USING btree ("tenant_id","work_order_id");--> statement-breakpoint
CREATE INDEX "idx_wo_approvals_approver" ON "work_order_approvals" USING btree ("tenant_id","approver_id");--> statement-breakpoint
CREATE INDEX "idx_wo_approvals_status" ON "work_order_approvals" USING btree ("tenant_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_maint_plans_tenant_code" ON "maintenance_plans" USING btree ("tenant_id","plan_code");--> statement-breakpoint
CREATE INDEX "idx_maint_plans_tenant_active" ON "maintenance_plans" USING btree ("tenant_id","is_active");--> statement-breakpoint
CREATE INDEX "idx_maint_plans_tenant_asset" ON "maintenance_plans" USING btree ("tenant_id","asset_id");--> statement-breakpoint
CREATE INDEX "idx_maint_plans_next_due" ON "maintenance_plans" USING btree ("tenant_id","next_due_date");--> statement-breakpoint
CREATE INDEX "idx_maint_plans_plan_type" ON "maintenance_plans" USING btree ("tenant_id","plan_type");--> statement-breakpoint
CREATE INDEX "idx_maint_tasks_tenant_wo" ON "maintenance_tasks" USING btree ("tenant_id","work_order_id");--> statement-breakpoint
CREATE INDEX "idx_maint_tasks_status" ON "maintenance_tasks" USING btree ("tenant_id","status");--> statement-breakpoint
CREATE INDEX "idx_maint_tasks_sequence" ON "maintenance_tasks" USING btree ("work_order_id","sequence");--> statement-breakpoint
CREATE INDEX "idx_spare_parts_tenant_wo" ON "spare_parts_usage" USING btree ("tenant_id","work_order_id");--> statement-breakpoint
CREATE INDEX "idx_spare_parts_stock_item" ON "spare_parts_usage" USING btree ("tenant_id","stock_item_id");--> statement-breakpoint
CREATE INDEX "idx_spare_parts_issued_at" ON "spare_parts_usage" USING btree ("tenant_id","issued_at");--> statement-breakpoint
CREATE INDEX "idx_maint_history_tenant_asset" ON "maintenance_history" USING btree ("tenant_id","asset_id");--> statement-breakpoint
CREATE INDEX "idx_maint_history_completion" ON "maintenance_history" USING btree ("tenant_id","completion_date");--> statement-breakpoint
CREATE INDEX "idx_maint_history_event_type" ON "maintenance_history" USING btree ("tenant_id","event_type");--> statement-breakpoint
CREATE INDEX "idx_maint_history_wo" ON "maintenance_history" USING btree ("tenant_id","work_order_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_maint_routes_tenant_code" ON "maintenance_routes" USING btree ("tenant_id","route_code");--> statement-breakpoint
CREATE INDEX "idx_maint_routes_tenant_active" ON "maintenance_routes" USING btree ("tenant_id","is_active");--> statement-breakpoint
CREATE INDEX "idx_maint_routes_site" ON "maintenance_routes" USING btree ("tenant_id","site_id");--> statement-breakpoint
CREATE INDEX "idx_route_stops_route" ON "route_stops" USING btree ("route_id","stop_sequence");--> statement-breakpoint
CREATE INDEX "idx_route_stops_tenant" ON "route_stops" USING btree ("tenant_id","route_id");--> statement-breakpoint
CREATE INDEX "idx_route_stops_asset" ON "route_stops" USING btree ("tenant_id","asset_id");--> statement-breakpoint
CREATE INDEX "idx_route_exec_tenant_route" ON "route_executions" USING btree ("tenant_id","route_id");--> statement-breakpoint
CREATE INDEX "idx_route_exec_status" ON "route_executions" USING btree ("tenant_id","status");--> statement-breakpoint
CREATE INDEX "idx_route_exec_started" ON "route_executions" USING btree ("tenant_id","started_at");--> statement-breakpoint
CREATE INDEX "idx_route_exec_executed_by" ON "route_executions" USING btree ("tenant_id","executed_by");--> statement-breakpoint
CREATE INDEX "idx_stop_readings_execution" ON "route_stop_readings" USING btree ("execution_id");--> statement-breakpoint
CREATE INDEX "idx_stop_readings_stop" ON "route_stop_readings" USING btree ("stop_id");--> statement-breakpoint
CREATE INDEX "idx_shutdown_events_tenant_status" ON "shutdown_events" USING btree ("tenant_id","status");--> statement-breakpoint
CREATE INDEX "idx_shutdown_events_tenant_site" ON "shutdown_events" USING btree ("tenant_id","site_id");--> statement-breakpoint
CREATE INDEX "idx_shutdown_events_planned_start" ON "shutdown_events" USING btree ("tenant_id","planned_start");--> statement-breakpoint
CREATE INDEX "idx_scope_items_tenant_shutdown" ON "shutdown_scope_items" USING btree ("tenant_id","shutdown_id");--> statement-breakpoint
CREATE INDEX "idx_scope_items_asset" ON "shutdown_scope_items" USING btree ("tenant_id","asset_id");--> statement-breakpoint
CREATE INDEX "idx_scope_items_wo" ON "shutdown_scope_items" USING btree ("tenant_id","work_order_id");--> statement-breakpoint
CREATE INDEX "idx_scope_items_status" ON "shutdown_scope_items" USING btree ("tenant_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_crafts_tenant_code" ON "crafts" USING btree ("tenant_id","code");--> statement-breakpoint
CREATE INDEX "idx_crafts_tenant_active" ON "crafts" USING btree ("tenant_id","is_active");--> statement-breakpoint
CREATE INDEX "idx_craft_certs_tenant_user" ON "craft_certifications" USING btree ("tenant_id","user_id");--> statement-breakpoint
CREATE INDEX "idx_craft_certs_tenant_craft" ON "craft_certifications" USING btree ("tenant_id","craft_id");--> statement-breakpoint
CREATE INDEX "idx_craft_certs_status" ON "craft_certifications" USING btree ("tenant_id","status");--> statement-breakpoint
CREATE INDEX "idx_craft_certs_expiry" ON "craft_certifications" USING btree ("tenant_id","expiry_date");--> statement-breakpoint
CREATE INDEX "idx_crews_tenant_active" ON "crews" USING btree ("tenant_id","is_active");--> statement-breakpoint
CREATE INDEX "idx_crews_supervisor" ON "crews" USING btree ("tenant_id","supervisor_id");--> statement-breakpoint
CREATE INDEX "idx_crews_site" ON "crews" USING btree ("tenant_id","site_id");--> statement-breakpoint
CREATE INDEX "idx_crew_members_crew" ON "crew_members" USING btree ("crew_id");--> statement-breakpoint
CREATE INDEX "idx_crew_members_user" ON "crew_members" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_shifts_tenant_active" ON "shifts" USING btree ("tenant_id","is_active");--> statement-breakpoint
CREATE INDEX "idx_labor_rates_tenant_craft" ON "labor_rates" USING btree ("tenant_id","craft_id");--> statement-breakpoint
CREATE INDEX "idx_labor_rates_effective" ON "labor_rates" USING btree ("tenant_id","craft_id","effective_date");--> statement-breakpoint
CREATE INDEX "idx_labor_bookings_tenant_wo" ON "labor_bookings" USING btree ("tenant_id","work_order_id");--> statement-breakpoint
CREATE INDEX "idx_labor_bookings_tenant_user" ON "labor_bookings" USING btree ("tenant_id","user_id");--> statement-breakpoint
CREATE INDEX "idx_labor_bookings_tenant_craft" ON "labor_bookings" USING btree ("tenant_id","craft_id");--> statement-breakpoint
CREATE INDEX "idx_labor_bookings_start" ON "labor_bookings" USING btree ("tenant_id","start_time");--> statement-breakpoint
CREATE INDEX "idx_labor_bookings_status" ON "labor_bookings" USING btree ("tenant_id","status");--> statement-breakpoint
CREATE INDEX "idx_labor_avail_tenant_user_date" ON "labor_availability" USING btree ("tenant_id","user_id","date");--> statement-breakpoint
CREATE INDEX "idx_labor_avail_tenant_date" ON "labor_availability" USING btree ("tenant_id","date");--> statement-breakpoint
CREATE INDEX "idx_labor_avail_type" ON "labor_availability" USING btree ("tenant_id","availability_type");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_storerooms_tenant_code" ON "storerooms" USING btree ("tenant_id","code");--> statement-breakpoint
CREATE INDEX "idx_storerooms_tenant_active" ON "storerooms" USING btree ("tenant_id","is_active");--> statement-breakpoint
CREATE INDEX "idx_storerooms_location" ON "storerooms" USING btree ("tenant_id","location_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_stock_items_tenant_part" ON "stock_items" USING btree ("tenant_id","part_number");--> statement-breakpoint
CREATE INDEX "idx_stock_items_tenant_active" ON "stock_items" USING btree ("tenant_id","is_active");--> statement-breakpoint
CREATE INDEX "idx_stock_items_category" ON "stock_items" USING btree ("tenant_id","category");--> statement-breakpoint
CREATE INDEX "idx_stock_items_critical" ON "stock_items" USING btree ("tenant_id","is_critical_spare");--> statement-breakpoint
CREATE INDEX "idx_stock_items_manufacturer" ON "stock_items" USING btree ("tenant_id","manufacturer");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_stock_levels_item_storeroom" ON "stock_levels" USING btree ("tenant_id","stock_item_id","storeroom_id");--> statement-breakpoint
CREATE INDEX "idx_stock_levels_storeroom" ON "stock_levels" USING btree ("tenant_id","storeroom_id");--> statement-breakpoint
CREATE INDEX "idx_stock_levels_low_stock" ON "stock_levels" USING btree ("tenant_id","qty_on_hand");--> statement-breakpoint
CREATE INDEX "idx_stock_txn_tenant_item" ON "stock_transactions" USING btree ("tenant_id","stock_item_id");--> statement-breakpoint
CREATE INDEX "idx_stock_txn_tenant_storeroom" ON "stock_transactions" USING btree ("tenant_id","storeroom_id");--> statement-breakpoint
CREATE INDEX "idx_stock_txn_type" ON "stock_transactions" USING btree ("tenant_id","transaction_type");--> statement-breakpoint
CREATE INDEX "idx_stock_txn_performed" ON "stock_transactions" USING btree ("tenant_id","performed_at");--> statement-breakpoint
CREATE INDEX "idx_stock_txn_wo" ON "stock_transactions" USING btree ("tenant_id","work_order_id");--> statement-breakpoint
CREATE INDEX "idx_bom_tenant_asset" ON "bill_of_materials" USING btree ("tenant_id","asset_id");--> statement-breakpoint
CREATE INDEX "idx_bom_stock_item" ON "bill_of_materials" USING btree ("tenant_id","stock_item_id");--> statement-breakpoint
CREATE INDEX "idx_cc_items_count" ON "cycle_count_items" USING btree ("count_id");--> statement-breakpoint
CREATE INDEX "idx_cc_items_stock_item" ON "cycle_count_items" USING btree ("stock_item_id");--> statement-breakpoint
CREATE INDEX "idx_cycle_counts_tenant_storeroom" ON "cycle_counts" USING btree ("tenant_id","storeroom_id");--> statement-breakpoint
CREATE INDEX "idx_cycle_counts_status" ON "cycle_counts" USING btree ("tenant_id","status");--> statement-breakpoint
CREATE INDEX "idx_cycle_counts_date" ON "cycle_counts" USING btree ("tenant_id","count_date");--> statement-breakpoint
CREATE INDEX "idx_reorder_rules_tenant_item" ON "reorder_rules" USING btree ("tenant_id","stock_item_id");--> statement-breakpoint
CREATE INDEX "idx_reorder_rules_tenant_storeroom" ON "reorder_rules" USING btree ("tenant_id","storeroom_id");--> statement-breakpoint
CREATE INDEX "idx_reorder_rules_active" ON "reorder_rules" USING btree ("tenant_id","is_active");--> statement-breakpoint
CREATE UNIQUE INDEX "vendors_tenant_code_idx" ON "vendors" USING btree ("tenant_id","code");--> statement-breakpoint
CREATE INDEX "warranty_terms_tenant_id_idx" ON "warranty_terms" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "warranty_terms_vendor_id_idx" ON "warranty_terms" USING btree ("tenant_id","vendor_id");--> statement-breakpoint
CREATE INDEX "warranty_terms_coverage_type_idx" ON "warranty_terms" USING btree ("tenant_id","coverage_type");--> statement-breakpoint
CREATE UNIQUE INDEX "warranty_terms_tenant_name_idx" ON "warranty_terms" USING btree ("tenant_id","name");--> statement-breakpoint
CREATE INDEX "warranty_coverage_tenant_id_idx" ON "warranty_coverage" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "warranty_coverage_asset_id_idx" ON "warranty_coverage" USING btree ("tenant_id","asset_id");--> statement-breakpoint
CREATE INDEX "warranty_coverage_status_idx" ON "warranty_coverage" USING btree ("tenant_id","status");--> statement-breakpoint
CREATE INDEX "warranty_coverage_end_date_idx" ON "warranty_coverage" USING btree ("tenant_id","end_date");--> statement-breakpoint
CREATE INDEX "warranty_coverage_warranty_term_id_idx" ON "warranty_coverage" USING btree ("tenant_id","warranty_term_id");--> statement-breakpoint
CREATE INDEX "warranty_claims_tenant_id_idx" ON "warranty_claims" USING btree ("tenant_id");--> statement-breakpoint
CREATE UNIQUE INDEX "warranty_claims_tenant_claim_number_idx" ON "warranty_claims" USING btree ("tenant_id","claim_number");--> statement-breakpoint
CREATE INDEX "warranty_claims_coverage_id_idx" ON "warranty_claims" USING btree ("tenant_id","coverage_id");--> statement-breakpoint
CREATE INDEX "warranty_claims_status_idx" ON "warranty_claims" USING btree ("tenant_id","status");--> statement-breakpoint
CREATE INDEX "warranty_claims_work_order_id_idx" ON "warranty_claims" USING btree ("tenant_id","work_order_id");--> statement-breakpoint
CREATE INDEX "sla_definitions_tenant_id_idx" ON "sla_definitions" USING btree ("tenant_id");--> statement-breakpoint
CREATE UNIQUE INDEX "sla_definitions_tenant_name_idx" ON "sla_definitions" USING btree ("tenant_id","name");--> statement-breakpoint
CREATE INDEX "sla_definitions_category_idx" ON "sla_definitions" USING btree ("tenant_id","category");--> statement-breakpoint
CREATE INDEX "sla_definitions_is_active_idx" ON "sla_definitions" USING btree ("tenant_id","is_active");--> statement-breakpoint
CREATE INDEX "sla_targets_tenant_id_idx" ON "sla_targets" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "sla_targets_sla_id_idx" ON "sla_targets" USING btree ("tenant_id","sla_id");--> statement-breakpoint
CREATE INDEX "sla_targets_metric_name_idx" ON "sla_targets" USING btree ("tenant_id","metric_name");--> statement-breakpoint
CREATE INDEX "sla_tracking_tenant_id_idx" ON "sla_tracking" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "sla_tracking_sla_target_id_idx" ON "sla_tracking" USING btree ("tenant_id","sla_target_id");--> statement-breakpoint
CREATE INDEX "sla_tracking_work_order_id_idx" ON "sla_tracking" USING btree ("tenant_id","work_order_id");--> statement-breakpoint
CREATE INDEX "sla_tracking_asset_id_idx" ON "sla_tracking" USING btree ("tenant_id","asset_id");--> statement-breakpoint
CREATE INDEX "sla_tracking_is_passing_idx" ON "sla_tracking" USING btree ("tenant_id","is_passing");--> statement-breakpoint
CREATE INDEX "sla_tracking_breach_at_idx" ON "sla_tracking" USING btree ("tenant_id","breach_at");--> statement-breakpoint
CREATE INDEX "sla_breaches_tenant_id_idx" ON "sla_breaches" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "sla_breaches_tracking_id_idx" ON "sla_breaches" USING btree ("tenant_id","tracking_id");--> statement-breakpoint
CREATE INDEX "sla_breaches_breach_type_idx" ON "sla_breaches" USING btree ("tenant_id","breach_type");--> statement-breakpoint
CREATE INDEX "sla_breaches_breached_at_idx" ON "sla_breaches" USING btree ("tenant_id","breached_at");--> statement-breakpoint
CREATE INDEX "sla_breaches_escalated_to_idx" ON "sla_breaches" USING btree ("tenant_id","escalated_to");--> statement-breakpoint
CREATE UNIQUE INDEX "contractors_tenant_code_idx" ON "contractors" USING btree ("tenant_id","code");--> statement-breakpoint
CREATE INDEX "contractors_tenant_id_idx" ON "contractors" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "contractors_name_idx" ON "contractors" USING btree ("tenant_id","name");--> statement-breakpoint
CREATE INDEX "contractors_is_approved_idx" ON "contractors" USING btree ("tenant_id","is_approved");--> statement-breakpoint
CREATE INDEX "contractors_is_active_idx" ON "contractors" USING btree ("tenant_id","is_active");--> statement-breakpoint
CREATE UNIQUE INDEX "contracts_tenant_contract_number_idx" ON "contracts" USING btree ("tenant_id","contract_number");--> statement-breakpoint
CREATE INDEX "contracts_tenant_id_idx" ON "contracts" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "contracts_contractor_id_idx" ON "contracts" USING btree ("tenant_id","contractor_id");--> statement-breakpoint
CREATE INDEX "contracts_status_idx" ON "contracts" USING btree ("tenant_id","status");--> statement-breakpoint
CREATE INDEX "contracts_type_idx" ON "contracts" USING btree ("tenant_id","type");--> statement-breakpoint
CREATE INDEX "contracts_end_date_idx" ON "contracts" USING btree ("tenant_id","end_date");--> statement-breakpoint
CREATE INDEX "contract_line_items_tenant_id_idx" ON "contract_line_items" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "contract_line_items_contract_id_idx" ON "contract_line_items" USING btree ("tenant_id","contract_id");--> statement-breakpoint
CREATE INDEX "contract_line_items_category_idx" ON "contract_line_items" USING btree ("tenant_id","category");--> statement-breakpoint
CREATE INDEX "contractor_personnel_tenant_id_idx" ON "contractor_personnel" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "contractor_personnel_contractor_id_idx" ON "contractor_personnel" USING btree ("tenant_id","contractor_id");--> statement-breakpoint
CREATE INDEX "contractor_personnel_badge_number_idx" ON "contractor_personnel" USING btree ("tenant_id","badge_number");--> statement-breakpoint
CREATE INDEX "contractor_personnel_is_active_idx" ON "contractor_personnel" USING btree ("tenant_id","is_active");--> statement-breakpoint
CREATE INDEX "contractor_personnel_site_access_expiry_idx" ON "contractor_personnel" USING btree ("tenant_id","site_access_expiry");--> statement-breakpoint
CREATE INDEX "contractor_safety_records_tenant_id_idx" ON "contractor_safety_records" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "contractor_safety_records_contractor_id_idx" ON "contractor_safety_records" USING btree ("tenant_id","contractor_id");--> statement-breakpoint
CREATE INDEX "contractor_safety_records_personnel_id_idx" ON "contractor_safety_records" USING btree ("tenant_id","personnel_id");--> statement-breakpoint
CREATE INDEX "contractor_safety_records_record_type_idx" ON "contractor_safety_records" USING btree ("tenant_id","record_type");--> statement-breakpoint
CREATE INDEX "contractor_safety_records_record_date_idx" ON "contractor_safety_records" USING btree ("tenant_id","record_date");--> statement-breakpoint
CREATE UNIQUE INDEX "work_permits_tenant_permit_number_idx" ON "work_permits" USING btree ("tenant_id","permit_number");--> statement-breakpoint
CREATE INDEX "work_permits_tenant_id_idx" ON "work_permits" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "work_permits_status_idx" ON "work_permits" USING btree ("tenant_id","status");--> statement-breakpoint
CREATE INDEX "work_permits_type_idx" ON "work_permits" USING btree ("tenant_id","type");--> statement-breakpoint
CREATE INDEX "work_permits_work_order_id_idx" ON "work_permits" USING btree ("tenant_id","work_order_id");--> statement-breakpoint
CREATE INDEX "work_permits_asset_id_idx" ON "work_permits" USING btree ("tenant_id","asset_id");--> statement-breakpoint
CREATE INDEX "work_permits_location_id_idx" ON "work_permits" USING btree ("tenant_id","location_id");--> statement-breakpoint
CREATE INDEX "work_permits_valid_to_idx" ON "work_permits" USING btree ("tenant_id","valid_to");--> statement-breakpoint
CREATE UNIQUE INDEX "permit_types_tenant_code_idx" ON "permit_types" USING btree ("tenant_id","code");--> statement-breakpoint
CREATE INDEX "permit_types_tenant_id_idx" ON "permit_types" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "permit_types_is_active_idx" ON "permit_types" USING btree ("tenant_id","is_active");--> statement-breakpoint
CREATE INDEX "isolation_points_tenant_id_idx" ON "isolation_points" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "isolation_points_asset_id_idx" ON "isolation_points" USING btree ("tenant_id","asset_id");--> statement-breakpoint
CREATE UNIQUE INDEX "isolation_points_tenant_point_number_idx" ON "isolation_points" USING btree ("tenant_id","point_number");--> statement-breakpoint
CREATE INDEX "isolation_points_point_type_idx" ON "isolation_points" USING btree ("tenant_id","point_type");--> statement-breakpoint
CREATE INDEX "loto_applications_tenant_id_idx" ON "loto_applications" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "loto_applications_procedure_id_idx" ON "loto_applications" USING btree ("tenant_id","procedure_id");--> statement-breakpoint
CREATE INDEX "loto_applications_work_permit_id_idx" ON "loto_applications" USING btree ("tenant_id","work_permit_id");--> statement-breakpoint
CREATE INDEX "loto_applications_status_idx" ON "loto_applications" USING btree ("tenant_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "loto_procedures_tenant_procedure_number_idx" ON "loto_procedures" USING btree ("tenant_id","procedure_number");--> statement-breakpoint
CREATE INDEX "loto_procedures_tenant_id_idx" ON "loto_procedures" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "loto_procedures_asset_id_idx" ON "loto_procedures" USING btree ("tenant_id","asset_id");--> statement-breakpoint
CREATE INDEX "loto_procedures_is_active_idx" ON "loto_procedures" USING btree ("tenant_id","is_active");--> statement-breakpoint
CREATE INDEX "safety_observations_tenant_id_idx" ON "safety_observations" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "safety_observations_type_idx" ON "safety_observations" USING btree ("tenant_id","observation_type");--> statement-breakpoint
CREATE INDEX "safety_observations_status_idx" ON "safety_observations" USING btree ("tenant_id","status");--> statement-breakpoint
CREATE INDEX "safety_observations_location_id_idx" ON "safety_observations" USING btree ("tenant_id","location_id");--> statement-breakpoint
CREATE INDEX "safety_observations_reported_by_idx" ON "safety_observations" USING btree ("tenant_id","reported_by");--> statement-breakpoint
CREATE INDEX "safety_observations_reported_at_idx" ON "safety_observations" USING btree ("tenant_id","reported_at");--> statement-breakpoint
CREATE UNIQUE INDEX "cost_centers_tenant_code_idx" ON "cost_centers" USING btree ("tenant_id","code");--> statement-breakpoint
CREATE UNIQUE INDEX "budgets_cc_year_type_idx" ON "budgets" USING btree ("cost_center_id","fiscal_year","budget_type");--> statement-breakpoint
CREATE INDEX "cost_tx_asset_idx" ON "cost_transactions" USING btree ("asset_id","transaction_date");--> statement-breakpoint
CREATE INDEX "cost_tx_tenant_date_idx" ON "cost_transactions" USING btree ("tenant_id","transaction_date");--> statement-breakpoint
CREATE UNIQUE INDEX "depr_schedule_profile_period_idx" ON "depreciation_schedule" USING btree ("profile_id","period_number");--> statement-breakpoint
CREATE INDEX "depr_schedule_asset_period_idx" ON "depreciation_schedule" USING btree ("asset_id","period_start","period_end");--> statement-breakpoint
CREATE UNIQUE INDEX "cost_rollup_asset_period_idx" ON "asset_cost_rollup" USING btree ("asset_id","period_type","period_start");--> statement-breakpoint
CREATE INDEX "cost_rollup_tenant_period_idx" ON "asset_cost_rollup" USING btree ("tenant_id","period_type","period_start");--> statement-breakpoint
CREATE INDEX "cost_rollup_asset_type_idx" ON "asset_cost_rollup" USING btree ("asset_id","period_type","period_start");--> statement-breakpoint
CREATE INDEX "idx_asset_functions_tenant" ON "asset_functions" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_asset_functions_asset" ON "asset_functions" USING btree ("tenant_id","asset_id");--> statement-breakpoint
CREATE INDEX "idx_asset_functions_type" ON "asset_functions" USING btree ("tenant_id","function_type");--> statement-breakpoint
CREATE INDEX "idx_func_failures_tenant" ON "functional_failures" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_func_failures_function" ON "functional_failures" USING btree ("tenant_id","function_id");--> statement-breakpoint
CREATE INDEX "idx_func_failures_type" ON "functional_failures" USING btree ("tenant_id","failure_type");--> statement-breakpoint
CREATE INDEX "idx_failure_modes_tenant" ON "failure_modes" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_failure_modes_func_failure" ON "failure_modes" USING btree ("tenant_id","functional_failure_id");--> statement-breakpoint
CREATE INDEX "idx_failure_modes_category" ON "failure_modes" USING btree ("tenant_id","category");--> statement-breakpoint
CREATE INDEX "idx_failure_modes_asset_type" ON "failure_modes" USING btree ("tenant_id","asset_type_id");--> statement-breakpoint
CREATE INDEX "idx_failure_modes_code" ON "failure_modes" USING btree ("tenant_id","mode_code");--> statement-breakpoint
CREATE INDEX "idx_fmea_analyses_tenant" ON "fmea_analyses" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_fmea_analyses_asset" ON "fmea_analyses" USING btree ("tenant_id","asset_id");--> statement-breakpoint
CREATE INDEX "idx_fmea_analyses_status" ON "fmea_analyses" USING btree ("tenant_id","status");--> statement-breakpoint
CREATE INDEX "idx_fmea_worksheets_analysis" ON "fmea_worksheets" USING btree ("analysis_id");--> statement-breakpoint
CREATE INDEX "idx_fmea_worksheets_failure_mode" ON "fmea_worksheets" USING btree ("failure_mode_id");--> statement-breakpoint
CREATE INDEX "idx_fmea_worksheets_rpn" ON "fmea_worksheets" USING btree ("rpn");--> statement-breakpoint
CREATE INDEX "idx_fmea_worksheets_assigned" ON "fmea_worksheets" USING btree ("assigned_to");--> statement-breakpoint
CREATE INDEX "idx_fmea_worksheets_status" ON "fmea_worksheets" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_failure_events_tenant" ON "failure_events" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_failure_events_asset" ON "failure_events" USING btree ("tenant_id","asset_id");--> statement-breakpoint
CREATE INDEX "idx_failure_events_mode" ON "failure_events" USING btree ("tenant_id","failure_mode_id");--> statement-breakpoint
CREATE INDEX "idx_failure_events_date" ON "failure_events" USING btree ("tenant_id","event_date");--> statement-breakpoint
CREATE INDEX "idx_failure_events_work_order" ON "failure_events" USING btree ("work_order_id");--> statement-breakpoint
CREATE INDEX "idx_rcm_decisions_tenant" ON "rcm_decisions" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_rcm_decisions_failure_mode" ON "rcm_decisions" USING btree ("tenant_id","failure_mode_id");--> statement-breakpoint
CREATE INDEX "idx_rcm_decisions_type" ON "rcm_decisions" USING btree ("tenant_id","decision_type");--> statement-breakpoint
CREATE INDEX "idx_rcm_decisions_consequence" ON "rcm_decisions" USING btree ("tenant_id","consequence_type");--> statement-breakpoint
CREATE INDEX "idx_rcm_decisions_plan" ON "rcm_decisions" USING btree ("maintenance_plan_id");--> statement-breakpoint
CREATE INDEX "idx_criticality_tenant" ON "criticality_analyses" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "idx_criticality_asset" ON "criticality_analyses" USING btree ("tenant_id","asset_id");--> statement-breakpoint
CREATE INDEX "idx_criticality_overall" ON "criticality_analyses" USING btree ("tenant_id","overall_criticality");--> statement-breakpoint
CREATE INDEX "idx_criticality_methodology" ON "criticality_analyses" USING btree ("tenant_id","methodology");--> statement-breakpoint
CREATE INDEX "reliability_asset_date_idx" ON "reliability_metrics" USING btree ("asset_id","calculation_date");--> statement-breakpoint
CREATE UNIQUE INDEX "sensor_tenant_code_idx" ON "sensor_registry" USING btree ("tenant_id","sensor_code");