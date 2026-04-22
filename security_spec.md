# Security Specification - PadhakuPortal

## Data Invariants
1. Only the verified admin (`kishantakodara4@gmail.com`) can create, update, or delete content (PYQs, Notes, Announcements).
2. Students can read all published content.
3. Timestamps must be server-generated.
4. Document IDs must be valid and size-constrained.
5. All fields must match the schema defined in the blueprint.

## The "Dirty Dozen" Payloads
1. **User Spoofing**: Attempting to create a PYQ with a different `authorId` (if we had one, but here it's admin-only).
2. **Anonymous Write**: Attempting to post an announcement without being logged in.
3. **Invalid ID**: Injecting a 2KB string as a document ID.
4. **Shadow Field**: Adding `isVerified: true` to a note metadata.
5. **Timestamp Manipulation**: Sending a client-side date for `createdAt`.
6. **Type Mismatch**: Sending `year: "2024"` (string) instead of a number.
7. **Size Attack**: Sending a 1MB string for the announcement `text`.
8. **Relational Orphan**: Creating a PYQ for a non-existent department (logic check).
9. **Role Escalation**: Attempting to write to an `admins` collection if it existed.
10. **Immutable Field Change**: Trying to update `pdfUrl` (if we mark it as immutable).
11. **Outcome Manipulation**: Changing a submission status to "published" by a non-admin (if using submissions).
12. **Blanket Read Query**: Querying all collections without filters (if we restrict list).

## Test Cases
- [ ] Deny non-admin creates in `pyqs`
- [ ] Allow admin create in `pyqs` with valid data
- [ ] Deny invalid type for `semester`
- [ ] Deny oversized announcement text
- [ ] Allow public read on `announcements`
- [ ] Deny update to `createdAt`
