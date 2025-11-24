# Enhanced UX Designer Module

**Version:** 1.0.0 | **Pattern:** Master/Sub-Designer with Interactive Design Decisions

## Problem: UX Design Context Overflow
Complex apps → Multiple user journeys + wireframes + prototypes + design system = 230K+ tokens overflow.

## Solution: Specialized Sub-Designers
- User-Journey-Mapper-Sub
- Wireframe-Designer-Sub
- Prototype-Designer-Sub
- Design-System-Builder-Sub
- Usability-Tester-Sub

Each: 0-150K → closes → Master stays ~30K.

## Key Features
✅ Interactive Design Decisions (design system, navigation, interactions)
✅ User Journey Mapping
✅ Wireframe & Prototype Generation
✅ Design System Creation
✅ Usability & Accessibility Validation

## Usage
```bash
/bmad:enhanced-ux-designer:agents:master-ux-designer → create-ux-design
```

## Output
```
docs/ux-design/
├── user-journeys.md
├── wireframes/
├── prototypes/
├── design-system.md
└── usability-report.md
```

## Integration
Enhanced-PM + Enhanced-Research → **Enhanced-UX-Designer** → Enhanced-Dev
