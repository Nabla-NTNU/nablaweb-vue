-- Enums used by events
CREATE TYPE nablaweb_vue.event_type AS ENUM (
    'ordinary',
    'bedpress',
    'payment',
    'recurrent',
    'undefined'
);

CREATE TYPE nablaweb_vue.participant_status AS ENUM (
    'registered',
    'waitlisted',
    'cancelled'
);

-- nabla_events
CREATE TABLE IF NOT EXISTS nablaweb_vue.nabla_events (
    id                          UUID                    PRIMARY KEY DEFAULT gen_random_uuid(),
    start_time                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    end_time                    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    location                    TEXT                    NOT NULL DEFAULT '',
    event_type                  nablaweb_vue.event_type NOT NULL DEFAULT 'ordinary',
    is_hidden                   BOOLEAN                 NOT NULL DEFAULT false,
    registration_required       BOOLEAN                 NOT NULL DEFAULT true,
    organiser                   TEXT                    NOT NULL REFERENCES nablaweb_vue.nabla_groups(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    event_photo                 TEXT                    NOT NULL DEFAULT '',
    slug                        TEXT                    NOT NULL UNIQUE,
    global_registration_limit   INTEGER                 NOT NULL DEFAULT 0,
    recurrent_end_date          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CHECK (end_time > start_time)
    -- Prikker, gjør dette i nabla_user? beta-feature
);

ALTER TABLE nablaweb_vue.nabla_events ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON TABLE nablaweb_vue.nabla_events TO anon, authenticated, service_role;
GRANT INSERT, UPDATE, DELETE ON TABLE nablaweb_vue.nabla_events TO authenticated, service_role;

CREATE POLICY "Everyone can view non-hidden events"
    ON nablaweb_vue.nabla_events
    FOR SELECT
    TO anon, authenticated
    USING (is_hidden = false);

-- Simplified for now: admins can do everything. 
-- Later we should create different types of admins
CREATE POLICY "Admins can edit events"
    ON nablaweb_vue.nabla_events
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM nablaweb_vue.nabladmins AS a
            JOIN nablaweb_vue.nabla_users AS u ON u.username = a."user"
            WHERE u.supabase_id = (SELECT auth.uid())
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM nablaweb_vue.nabladmins AS a
            JOIN nablaweb_vue.nabla_users AS u ON u.username = a."user"
            WHERE u.supabase_id = (SELECT auth.uid())
        )
    );

COMMENT ON TABLE nablaweb_vue.nabla_events IS 'Events organised by Nabla groups';
COMMENT ON COLUMN nablaweb_vue.nabla_events.slug IS 'URL-facing identifier for the event, e.g. used at /events/<slug>';

-- nabla_events_translations
CREATE TABLE IF NOT EXISTS nablaweb_vue.nabla_events_translations (
    event           UUID NOT NULL REFERENCES nablaweb_vue.nabla_events(id) ON UPDATE CASCADE ON DELETE CASCADE,
    language        TEXT NOT NULL CHECK (language IN ('nb', 'en')),
    title           TEXT NOT NULL DEFAULT '',
    description     TEXT NOT NULL DEFAULT '',
    body_text       TEXT NOT NULL DEFAULT '',
    PRIMARY KEY (event, language)
);

ALTER TABLE nablaweb_vue.nabla_events_translations ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON TABLE nablaweb_vue.nabla_events_translations TO anon, authenticated, service_role;
GRANT INSERT, UPDATE, DELETE ON TABLE nablaweb_vue.nabla_events_translations TO authenticated, service_role;

CREATE POLICY "Everyone can view event translations"
    ON nablaweb_vue.nabla_events_translations
    FOR SELECT
    TO anon, authenticated, service_role
    USING (true);

CREATE POLICY "Admins can edit event translations"
    ON nablaweb_vue.nabla_events_translations
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM nablaweb_vue.nabladmins AS a
            JOIN nablaweb_vue.nabla_users AS u ON u.username = a."user"
            WHERE u.supabase_id = (SELECT auth.uid())
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM nablaweb_vue.nabladmins AS a
            JOIN nablaweb_vue.nabla_users AS u ON u.username = a."user"
            WHERE u.supabase_id = (SELECT auth.uid())
        )
    );

COMMENT ON TABLE nablaweb_vue.nabla_events_translations IS 'Per-language title/description/body for an event';

-- nabla_events_registrations
-- There is one table for each class per event with class pricing
-- If there is no difference in price between classes class is set to NULL and the default is shown
CREATE TABLE IF NOT EXISTS nablaweb_vue.nabla_events_registrations (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event                 UUID NOT NULL REFERENCES nablaweb_vue.nabla_events(id) ON UPDATE CASCADE ON DELETE CASCADE,
    price_kr              INTEGER NOT NULL DEFAULT 0,
    class                 nablaweb_vue.class,
    class_capacity        INTEGER,
    payment_end           TIMESTAMP WITH TIME ZONE,
    registration_start    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    registration_end      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    deregistration_end    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

    CHECK (price_kr = 0 OR payment_end is NOT NULL)

);

CREATE UNIQUE INDEX ON nablaweb_vue.nabla_events_registrations (event, class)
    WHERE class IS NOT NULL;
CREATE UNIQUE INDEX ON nablaweb_vue.nabla_events_registrations (event)
    WHERE class IS NULL;

ALTER TABLE nablaweb_vue.nabla_events_registrations ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON TABLE nablaweb_vue.nabla_events_registrations TO anon, authenticated, service_role;
GRANT INSERT, UPDATE, DELETE ON TABLE nablaweb_vue.nabla_events_registrations TO authenticated, service_role;

CREATE POLICY "Everyone can view registration windows"
    ON nablaweb_vue.nabla_events_registrations
    FOR SELECT
    TO anon, authenticated, service_role
    USING (true);

CREATE POLICY "Admins can edit registration windows"
    ON nablaweb_vue.nabla_events_registrations
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM nablaweb_vue.nabladmins AS a
            JOIN nablaweb_vue.nabla_users AS u ON u.username = a."user"
            WHERE u.supabase_id = (SELECT auth.uid())
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM nablaweb_vue.nabladmins AS a
            JOIN nablaweb_vue.nabla_users AS u ON u.username = a."user"
            WHERE u.supabase_id = (SELECT auth.uid())
        )
    );

COMMENT ON TABLE nablaweb_vue.nabla_events_registrations IS 'Registration open/close windows per class for an event';

-- nabla_events_participants
CREATE TABLE IF NOT EXISTS nablaweb_vue.nabla_events_participants (
    event               UUID NOT NULL REFERENCES nablaweb_vue.nabla_events(id) ON UPDATE CASCADE ON DELETE CASCADE,
    username             TEXT NOT NULL REFERENCES nablaweb_vue.nabla_users(username) ON UPDATE CASCADE ON DELETE CASCADE,
    registration_tier    UUID REFERENCES nablaweb_vue.nabla_events_registrations(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    status               nablaweb_vue.participant_status NOT NULL DEFAULT 'registered',
    registered_at        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    PRIMARY KEY (event, username)
);

ALTER TABLE nablaweb_vue.nabla_events_participants ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON TABLE nablaweb_vue.nabla_events_participants TO anon, authenticated, service_role;
GRANT INSERT, UPDATE, DELETE ON TABLE nablaweb_vue.nabla_events_participants TO authenticated, service_role;

CREATE POLICY "Everyone can view participant lists"
    ON nablaweb_vue.nabla_events_participants
    FOR SELECT
    TO anon, authenticated, service_role
    USING (true);

CREATE POLICY "Admins can edit participant lists"
    ON nablaweb_vue.nabla_events_participants
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM nablaweb_vue.nabladmins AS a
            JOIN nablaweb_vue.nabla_users AS u ON u.username = a."user"
            WHERE u.supabase_id = (SELECT auth.uid())
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM nablaweb_vue.nabladmins AS a
            JOIN nablaweb_vue.nabla_users AS u ON u.username = a."user"
            WHERE u.supabase_id = (SELECT auth.uid())
        )
    );

-- Needs adding later: users registering/unregistering themselves,
-- e.g. `USING ((SELECT auth.uid()) = (SELECT supabase_id FROM nabla_users WHERE username = nabla_events_participants.username))`

COMMENT ON TABLE nablaweb_vue.nabla_events_participants IS 'Users registered/attending a given event';

-- nabla_events_owner_groups
CREATE TABLE IF NOT EXISTS nablaweb_vue.nabla_events_owner_groups (
    event               UUID NOT NULL REFERENCES nablaweb_vue.nabla_events(id) ON UPDATE CASCADE ON DELETE CASCADE,
    organizing_group    TEXT NOT NULL REFERENCES nablaweb_vue.nabla_groups(id) ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY (event, organizing_group)
);

ALTER TABLE nablaweb_vue.nabla_events_owner_groups ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON TABLE nablaweb_vue.nabla_events_owner_groups TO anon, authenticated, service_role;
GRANT INSERT, UPDATE, DELETE ON TABLE nablaweb_vue.nabla_events_owner_groups TO authenticated, service_role;

CREATE POLICY "Everyone can view co-organizing groups"
    ON nablaweb_vue.nabla_events_owner_groups
    FOR SELECT
    TO anon, authenticated, service_role
    USING (true);

CREATE POLICY "Admins can edit co-organizing groups"
    ON nablaweb_vue.nabla_events_owner_groups
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM nablaweb_vue.nabladmins AS a
            JOIN nablaweb_vue.nabla_users AS u ON u.username = a."user"
            WHERE u.supabase_id = (SELECT auth.uid())
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM nablaweb_vue.nabladmins AS a
            JOIN nablaweb_vue.nabla_users AS u ON u.username = a."user"
            WHERE u.supabase_id = (SELECT auth.uid())
        )
    );

COMMENT ON TABLE nablaweb_vue.nabla_events_owner_groups IS 'Additional groups co-organizing an event, alongside nabla_events.organiser';

-- nabla_events_owner_individuals
CREATE TABLE IF NOT EXISTS nablaweb_vue.nabla_events_owner_individuals (
    event       UUID NOT NULL REFERENCES nablaweb_vue.nabla_events(id) ON UPDATE CASCADE ON DELETE CASCADE,
    username    TEXT NOT NULL REFERENCES nablaweb_vue.nabla_users(username) ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY (event, username)
);

ALTER TABLE nablaweb_vue.nabla_events_owner_individuals ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON TABLE nablaweb_vue.nabla_events_owner_individuals TO anon, authenticated, service_role;
GRANT INSERT, UPDATE, DELETE ON TABLE nablaweb_vue.nabla_events_owner_individuals TO authenticated, service_role;

CREATE POLICY "Everyone can view individual owners"
    ON nablaweb_vue.nabla_events_owner_individuals
    FOR SELECT
    TO anon, authenticated, service_role
    USING (true);

CREATE POLICY "Admins can edit individual owners"
    ON nablaweb_vue.nabla_events_owner_individuals
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM nablaweb_vue.nabladmins AS a
            JOIN nablaweb_vue.nabla_users AS u ON u.username = a."user"
            WHERE u.supabase_id = (SELECT auth.uid())
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM nablaweb_vue.nabladmins AS a
            JOIN nablaweb_vue.nabla_users AS u ON u.username = a."user"
            WHERE u.supabase_id = (SELECT auth.uid())
        )
    );

COMMENT ON TABLE nablaweb_vue.nabla_events_owner_individuals IS 'Individual users with ownership/host permissions on an event';

-- nabla_events_comments
CREATE TABLE IF NOT EXISTS nablaweb_vue.nabla_events_comments (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event        UUID NOT NULL REFERENCES nablaweb_vue.nabla_events(id) ON UPDATE CASCADE ON DELETE CASCADE,
    username     TEXT NOT NULL REFERENCES nablaweb_vue.nabla_users(username) ON UPDATE CASCADE ON DELETE CASCADE,
    comment      TEXT NOT NULL DEFAULT '',
    created_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE nablaweb_vue.nabla_events_comments ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON TABLE nablaweb_vue.nabla_events_comments TO anon, authenticated, service_role;
GRANT INSERT, UPDATE, DELETE ON TABLE nablaweb_vue.nabla_events_comments TO authenticated, service_role;

CREATE POLICY "Everyone can view comments"
    ON nablaweb_vue.nabla_events_comments
    FOR SELECT
    TO anon, authenticated, service_role
    USING (true);

CREATE POLICY "Admins can edit comments"
    ON nablaweb_vue.nabla_events_comments
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM nablaweb_vue.nabladmins AS a
            JOIN nablaweb_vue.nabla_users AS u ON u.username = a."user"
            WHERE u.supabase_id = (SELECT auth.uid())
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM nablaweb_vue.nabladmins AS a
            JOIN nablaweb_vue.nabla_users AS u ON u.username = a."user"
            WHERE u.supabase_id = (SELECT auth.uid())
        )
    );

-- Needs adding: users writing/editing/deleting their own comments

COMMENT ON TABLE nablaweb_vue.nabla_events_comments IS 'Comments left on an event';

-- nabla_events_reactions
CREATE TABLE IF NOT EXISTS nablaweb_vue.nabla_events_reactions (
    event       UUID NOT NULL REFERENCES nablaweb_vue.nabla_events(id) ON UPDATE CASCADE ON DELETE CASCADE,
    username    TEXT NOT NULL REFERENCES nablaweb_vue.nabla_users(username) ON UPDATE CASCADE ON DELETE CASCADE,
    reaction    TEXT NOT NULL DEFAULT '',
    PRIMARY KEY (event, username, reaction)
);

ALTER TABLE nablaweb_vue.nabla_events_reactions ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON TABLE nablaweb_vue.nabla_events_reactions TO anon, authenticated, service_role;
GRANT INSERT, UPDATE, DELETE ON TABLE nablaweb_vue.nabla_events_reactions TO authenticated, service_role;

CREATE POLICY "Everyone can view reactions"
    ON nablaweb_vue.nabla_events_reactions
    FOR SELECT
    TO anon, authenticated, service_role
    USING (true);

CREATE POLICY "Admins can edit reactions"
    ON nablaweb_vue.nabla_events_reactions
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM nablaweb_vue.nabladmins AS a
            JOIN nablaweb_vue.nabla_users AS u ON u.username = a."user"
            WHERE u.supabase_id = (SELECT auth.uid())
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM nablaweb_vue.nabladmins AS a
            JOIN nablaweb_vue.nabla_users AS u ON u.username = a."user"
            WHERE u.supabase_id = (SELECT auth.uid())
        )
    );

COMMENT ON TABLE nablaweb_vue.nabla_events_reactions IS 'Emoji/reaction responses to an event';

-- nabla_events_comment_reactions
CREATE TABLE IF NOT EXISTS nablaweb_vue.nabla_events_comment_reactions (
    comment     UUID NOT NULL REFERENCES nablaweb_vue.nabla_events_comments(id) ON UPDATE CASCADE ON DELETE CASCADE,
    username    TEXT NOT NULL REFERENCES nablaweb_vue.nabla_users(username) ON UPDATE CASCADE ON DELETE CASCADE,
    reaction    TEXT NOT NULL DEFAULT '',
    PRIMARY KEY (comment, username, reaction)
);

ALTER TABLE nablaweb_vue.nabla_events_comment_reactions ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON TABLE nablaweb_vue.nabla_events_comment_reactions TO anon, authenticated, service_role;
GRANT INSERT, UPDATE, DELETE ON TABLE nablaweb_vue.nabla_events_comment_reactions TO authenticated, service_role;

CREATE POLICY "Everyone can view comment reactions"
    ON nablaweb_vue.nabla_events_comment_reactions
    FOR SELECT
    TO anon, authenticated, service_role
    USING (true);

CREATE POLICY "Admins can edit comment reactions"
    ON nablaweb_vue.nabla_events_comment_reactions
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM nablaweb_vue.nabladmins AS a
            JOIN nablaweb_vue.nabla_users AS u ON u.username = a."user"
            WHERE u.supabase_id = (SELECT auth.uid())
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM nablaweb_vue.nabladmins AS a
            JOIN nablaweb_vue.nabla_users AS u ON u.username = a."user"
            WHERE u.supabase_id = (SELECT auth.uid())
        )
    );

COMMENT ON TABLE nablaweb_vue.nabla_events_comment_reactions IS 'Emoji/reaction responses to a comment';
