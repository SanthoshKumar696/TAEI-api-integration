
--Transit Care
--get_cases_108_summary

-- Get summary for one hospital in September
SELECT * 
FROM get_cases_108_summary('2025-09-01 00:00:00', '2025-09-30 23:59:59', 'KARUR MEDICAL COLLEGE & HOSPITAL');

--If required please use it in future
--CREATE INDEX idx_cases108_date_hospital ON cases_108 ("InsertedDate", "HospitalName");

------------------------------------------------------------------

--Triage
SELECT * FROM get_triage_summary(
    '2025-08-01 00:00:00',
    '2025-09-26 23:59:59',
    2,          -- institution_id
    'KARUR MEDICAL COLLEGE & HOSPITAL'      -- hospital_name
);

--Index
-- -- Main filter
-- CREATE INDEX idx_triage_date_institution
--     ON triage (institution_id, date_time_of_triage);

-- -- For triage_by_108 join
-- CREATE INDEX idx_triage_by_108_triage_id
--     ON triage_by_108 (triage_id);

-- -- For triage_dtls join
-- CREATE INDEX idx_triage_dtls_triage_id
--     ON triage_dtls (triage_id);

-- -- For cases_108 pending lookup
-- CREATE INDEX idx_cases108_date_hospital
--     ON cases_108 ("HospitalName", "InsertedDate", "TriageId");

--This makes Postgres skip all rows where TriageId IS NOT NULL and directly scan only the subset you need.
-- CREATE INDEX idx_cases108_pending
--     ON cases_108 ("HospitalName", "InsertedDate")
--     WHERE "TriageId" IS NULL;


----------------------------------------------------------------
--EMO

-- --select all in traige 
-- select * from triage where date_time_of_triage 
--     between '2025-08-01 00:00:00' and '2025-09-30 23:59:59' and institution_id = 2

-- -- creoss check with emo
-- select * from emo_triage where triage_Id in(
--     select id from triage where date_time_of_triage 
--         between '2025-08-01 00:00:00' and '2025-09-30 23:59:59' and institution_id = 2
-- )

SELECT * FROM get_emo_triage_summary('2025-10-21 00:00:00', '2025-10-30 23:59:59', 2);

----------------------------------------------------------------
SELECT * FROM get_cases_108_summary('2025-10-31 00:00:00', '2025-10-31 23:59:59', 'TAMBARAM GH');

SELECT * FROM get_cases_108_summary('2025-11-04 00:00:00', '2025-11-04 23:59:59', 'ARIYALUR GH');
select * from public.get_triage_list(10, 0, 1, '2025-11-04 00:00:00', '2025-11-04 23:59:59')

select * from public.lkp_hospitals

select * from public.lkp_hospitals

select count(*), "InsertedDate"::date from public.cases_108 
where "InsertedDate"::date BETWEEN '2025-10-31 00:00:00'::date and '2025-10-31 23:59:59'::date and 
"HospitalName" = 'TAMBARAM GH'
group by "InsertedDate"::date
order by "InsertedDate"::date


select *,"InsertedDate"::date from public.cases_108 
where --"InsertedDate"::date BETWEEN '2025-10-31 00:00:00'::date and '2025-10-31 23:59:59'::date and 
"HospitalName" = 'TAMBARAM GH'

select '2025-10-31 00:00:00'::date,  '2025-10-31 23:59:59'::date

select * from public.get_triage_summary('2025-10-13 00:00:00', '2025-10-13 23:59:59', 1, 'ARIYALUR GH')

----------------------------------------------------------------

SELECT public.get_trauma_summary(
    '2025-10-21 00:00:00',
    '2025-11-03 23:59:59',
    2   -- institution_id
);

SELECT *--, *--ARRAY_AGG(tr.id)--, *
    FROM triage tr
    JOIN emo_triage emo 
        ON emo.triage_id = tr.id
    WHERE tr.institution_id = 2
      AND emo.inserted_date BETWEEN '2025-10-21 00:00:00' AND  '2025-11-03 23:59:59'
      AND emo.emergency_category IN (1, 2);

 SELECT *
        --COUNT(*) FILTER (WHERE td.triage_flag = 1),
        --COUNT(*) FILTER (WHERE td.triage_flag = 2),
       -- COUNT(*) FILTER (WHERE td.triage_flag = 3)
    
    FROM triage_dtls td
    WHERE td.triage_id in(1,3,9,25,26);


select * from trauma where triage_id in(1,3,9,25,26)

SELECT public.get_trauma_list(
	10,
	0,
	2,
	'2025-10-21 00:00:00',
	'2025-11-03 23:59:59'
)



--------
--Burns
SELECT public.get_burns_summary(
    '2025-10-21 00:00:00',
	'2025-11-03 23:59:59',
    2   -- institution_id
);

  SELECT *    
    FROM triage tr
    JOIN emo_triage emo 
        ON emo.triage_id = tr.id
    WHERE tr.institution_id = 2
      AND emo.inserted_date BETWEEN '2025-10-21 00:00:00' AND '2025-11-03 23:59:59'
      AND emo.emergency_category IN (3, 4);

SELECT    SUBSTRING('15%abc' FROM '^(-?\d+(\.\d+)?)') AS extracted_number;

SELECT *
       -- COUNT(*) FILTER (WHERE (b.tbsa_total_per ~ '^[0-9]+(\.[0-9]+)?$') AND b.tbsa_total_per::NUMERIC > 40),
       -- COUNT(*) FILTER (WHERE (b.tbsa_total_per ~ '^[0-9]+(\.[0-9]+)?$') AND b.tbsa_total_per::NUMERIC < 40)
    FROM burns b
    WHERE b.triage_id in(2,10,27);
-----------------


--Stroke

SELECT * FROM get_stroke_summary( '2025-10-21 00:00:00','2025-11-03 23:59:59', 2);

-----------------

--Poison

select * from get_poison_summary('2025-10-21 00:00:00','2025-11-03 23:59:59', 2);
-----------------

--bites
select * from get_bites_stings_summary('2025-10-21 00:00:00','2025-08-03 23:59:59', 2);



---get_prem_summary
select * from get_prem_summary('2025-10-21 00:00:00','2025-11-03 23:59:59', 2);

select * from get_prem_list(
	p_limit integer,
	p_offset integer,
	p_hospital_id integer,
	p_start_date timestamp without time zone,
	p_end_date timestamp without time zone)


-------------------------
--Get table Rowcount and size
SELECT 
    n.nspname AS schema_name,
    c.relname AS table_name,
    pg_size_pretty(pg_total_relation_size(c.oid)) AS total_size,
    pg_size_pretty(pg_relation_size(c.oid)) AS data_size,
    pg_size_pretty(pg_total_relation_size(c.oid) - pg_relation_size(c.oid)) AS index_size,
    c.reltuples::BIGINT AS estimated_row_count
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE c.relkind = 'r'  -- ordinary tables
  AND n.nspname = 'public'
  AND c.relname NOT LIKE 'lkp_%'
ORDER BY pg_total_relation_size(c.oid) DESC;
-------------------------


----
select * from get_trauma_list_filter(100, 0, 1, '2026-01-01 00:00:00', '2026-01-30 00:00:00', '', null)
select * from get_trauma_list(100, 0, 1, '2026-01-01 00:00:00', '2026-01-30 00:00:00')
----

select * from get_emo_triage_list_filter(10000, 0, 1, '2026-01-01 00:00:00', '2026-01-30 00:00:00', '', null)
select * from get_emo_triage_list(10000, 0, 1, '2026-01-01 00:00:00', '2026-01-30 00:00:00')
----

select * from get_stroke_list_filter(100, 0, 1, '2026-01-01 00:00:00', '2026-01-30 00:00:00', 'thi', null)
select * from get_stroke_list(100, 0, 1, '2026-01-01 00:00:00', '2026-01-30 00:00:00')
----

select * from get_prem_list_filter(100, 0, 1, '2026-01-01 00:00:00', '2026-01-30 00:00:00', '', null)
select * from get_prem_list(100, 0, 1, '2026-01-01 00:00:00', '2026-01-30 00:00:00')
----

select * from get_poison_list_filter(100, 0, 1, '2026-01-01 00:00:00', '2026-01-30 00:00:00', 'jen', 0)
select * from get_poison_list(100, 0, 1, '2026-01-01 00:00:00', '2026-01-30 00:00:00')

----
select * from get_hanging_list_filter(100, 0, 1, '2026-01-01 00:00:00', '2026-01-30 00:00:00', 'dev', 0)
select * from get_hanging_list(100, 0, 1, '2026-01-01 00:00:00', '2026-01-30 00:00:00')
-----

select * from get_burns_list_filter(100, 0, 1, '2026-01-01 00:00:00', '2026-01-30 00:00:00', 'raj', 0)
select * from get_burns_list(100, 0, 1, '2026-01-01 00:00:00', '2026-01-30 00:00:00')
-----

select * from get_bites_sting_list_filter(100, 0, 1, '2026-01-01 00:00:00', '2026-01-30 00:00:00', 'lat', 0)
select * from get_bites_sting_list(100, 0, 1, '2026-01-01 00:00:00', '2026-01-30 00:00:00')
-----

select * from get_bites_sting_list_filter(100, 0, 1, '2026-01-01 00:00:00', '2026-01-30 00:00:00', 'lat', 0)
select * from get_bites_sting_list(100, 0, 1, '2026-01-01 00:00:00', '2026-01-30 00:00:00')
-----
