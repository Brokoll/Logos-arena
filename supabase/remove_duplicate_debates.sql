-- Step 1: Find all debates with "부정선거" in the topic
SELECT id, topic, created_at 
FROM debates 
WHERE topic LIKE '%부정선거%' 
ORDER BY created_at;

-- Step 2: After reviewing the results above, identify which debates to keep (usually the oldest one)
-- Then uncomment and modify the DELETE statement below with the actual UUIDs

-- Example: If you want to keep the first one and delete the rest:
-- DELETE FROM debates 
-- WHERE topic LIKE '%부정선거%' 
-- AND id NOT IN (
--     SELECT id FROM debates 
--     WHERE topic LIKE '%부정선거%' 
--     ORDER BY created_at 
--     LIMIT 1
-- );

-- Or manually specify the UUIDs to delete:
-- DELETE FROM debates WHERE id IN (
--     'actual-uuid-1',
--     'actual-uuid-2'
-- );
