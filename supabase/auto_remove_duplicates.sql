-- Automatically delete duplicate "부정선거" debates, keeping only the oldest one
WITH duplicates AS (
    SELECT id, topic, created_at,
           ROW_NUMBER() OVER (PARTITION BY topic ORDER BY created_at) as rn
    FROM debates
    WHERE topic LIKE '%부정선거%'
)
DELETE FROM debates
WHERE id IN (
    SELECT id FROM duplicates WHERE rn > 1
);

-- Verify the result
SELECT id, topic, created_at 
FROM debates 
WHERE topic LIKE '%부정선거%' 
ORDER BY created_at;
