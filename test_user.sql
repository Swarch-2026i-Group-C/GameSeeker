INSERT INTO "user" (id, name, email, "emailVerified", "createdAt", "updatedAt") VALUES ('test-user-123', 'Test User', 'test@test.com', false, NOW(), NOW()) ON CONFLICT (id) DO NOTHING;
