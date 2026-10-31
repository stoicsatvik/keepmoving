-- Optional privacy maintenance. Run daily via your scheduler or Supabase SQL Editor.
-- Ended games are deleted after 24 hours (including associated player and GPS rows).
-- Abandoned waiting and active games are removed after 24 hours from creation.
delete from public.games
where (status = 'finished' and finished_at < now() - interval '24 hours')
   or (status = 'waiting' and created_at < now() - interval '24 hours')
   or (status = 'active' and started_at < now() - interval '24 hours');
