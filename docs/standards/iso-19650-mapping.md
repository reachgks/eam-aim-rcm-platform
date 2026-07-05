# ISO 19650 — Information Management with BIM

## Overview

ISO 19650 defines the framework for managing information over the whole lifecycle of a built asset using BIM. This platform implements ISO 19650 through its CDE and OIR/AIR modules.

## Key Concepts Implemented

### Common Data Environment (CDE)
- **WIP → Shared → Published → Archived** state machine (`cde/cde-states.ts`)
- Workflow definitions with role-based transitions (`cde/cde-workflows.ts`)
- Full revision history tracking (`cde/revision-history.ts`)

### Information Requirements
- **OIR**: Organizational Information Requirements (`oir-air/organizational-info-requirements.ts`)
- **AIR**: Asset Information Requirements (`oir-air/asset-info-requirements.ts`)
- **EIR**: Exchange Information Requirements (`oir-air/exchange-info-requirements.ts`)

### Level of Information Need (EN 17412)
- Geometry detail level, dimensionality, appearance (`oir-air/loin-definitions.ts`)
- Alphanumeric property requirements
- Documentation requirements

### Information Delivery
- MIDP/TIDP management (`oir-air/information-delivery-plans.ts`)
- Automated compliance checking (`oir-air/air-compliance-checks.ts`)
- Handover package management (`cde/handover-management.ts`)
