-- Actual table
CREATE TABLE IF NOT EXISTS nablaweb_vue.nabla_events (
    id                  TEXT            PRIMARY KEY,      
    slug                        TEXT                    NOT NULL DEFAULT '',
    event_photo                 TEXT                    NOT NULL DEFAULT '',
    start                       TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    end                         TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    location                    TEXT                    NOT NULL DEFAULT '',
    registration_required       BOOLEAN           NOT_NULL DEFAULT true,
    organiser                   TEXT                    NOT NULL REFERENCES nablaweb_vue.nabla_groups(id) ON UPDATE CASCADE ON DELETE CASCADE,
    global_registration_limit   INTEGER        NOT_NULL DEFAULT 0,
    is_hidden                   BOOLEAN                 NOT_NULL DEFAULT false
    --Prikker, vet ikke hvordan vi tenker å gjøre det
);

CREATE TABLE IF NOT EXISTS nablaweb_vue.nabla_events_translation_info (
    id              TEXT                    PRIMARY KEY,
    event         TEXT                    NOT NULL REFERENCES nablaweb_vue.nabla_events(id),
    is_norwegian    BOOLEAN                 NOT_NULL DEFAULT true,
    title_nb        TEXT                    NOT_NULL DEFAULT '',
    title_en        TEXT                    NOT_NULL DEFAULT '',
    desc_nb         TEXT                    NOT_NULL DEFAULT '',
    desc_en         TEXT                    NOT_NULL DEFAULT '',
    body_text_nb    TEXT                    NOT_NULL DEFAULT '',
    body_text_en    TEXT                    NOT_NULL DEFAULT ''

)

CREATE TABLE IF NOT EXISTS nablaweb_vue.nabla_events_registrations (
    id              TEXT                    PRIMARY KEY,
    event           TEXT NOT NULL REFERENCES nablaweb_vue.nabla_events(id)
    group           TEXT                    NOT NULL REFERENCES nablaweb_vue.nabla_groups(id) ON UPDATE CASCADE ON DELETE CASCADE,
    registration_start           TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    registration_end             TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    unregistrate_end             TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
    -- Evt. reservert plass? Men det tenkte vi kanskje å gjøre gjennom GUI-en

    
)

CREATE TABLE IF NOT EXISTS nablaweb_vue.nabla_events_participants (
    id              TEXT                    PRIMARY KEY,
    event           TEXT                    NOT NULL REFERENCES nablaweb_vue.nabla_events(id),
    user            TEXT                    NOT NULL REFERENCES nablaweb_vue.nabla_users(username) ON UPDATE CASCADE ON DELETE CASCADE,
    is_registrated        BOOLEAN                 NOT_NULL DEFAULT true,
    time_registrated        TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL


)


CREATE TABLE IF NOT EXISTS nablaweb_vue.nabla_events_owner_groups (
    id              TEXT                    PRIMARY KEY,
    event         TEXT NOT NULL REFERENCES nablaweb_vue.nabla_events(id),
    group           TEXT                    NOT NULL REFERENCES nablaweb_vue.nabla_groups(id) ON UPDATE CASCADE ON DELETE CASCADE
    
)


CREATE TABLE IF NOT EXISTS nablaweb_vue.nabla_events_owner_induviduals (
    id              TEXT                    PRIMARY KEY,
    event           TEXT NOT NULL REFERENCES nablaweb_vue.nabla_events(id),
    user            TEXT NOT NULL REFERENCES nablaweb_vue.nabla_users(username) ON UPDATE CASCADE ON DELETE CASCADE

    
)




CREATE TABLE IF NOT EXISTS nablaweb_vue.nabla_events_comments (
    id              TEXT                    PRIMARY KEY,
    event           TEXT                    NOT NULL REFERENCES nablaweb_vue.nabla_events(event_name),
    user            TEXT                    NOT NULL REFERENCES nablaweb_vue.nabla_users(username) ON UPDATE CASCADE ON DELETE CASCADE,
    comment         TEXT                    NOT_NULL DEFAULT ''

    
)


CREATE TABLE IF NOT EXISTS nablaweb_vue.nabla_events_reactions (
    id              TEXT                    PRIMARY KEY,
    event           TEXT                    NOT NULL REFERENCES nablaweb_vue.nabla_events(event_name),
    user            TEXT                    NOT NULL REFERENCES nablaweb_vue.nabla_users(username) ON UPDATE CASCADE ON DELETE CASCADE,
    reaction        TEXT                    NOT_NULL DEFAULT ''
)

CREATE TABLE IF NOT EXISTS nablaweb_vue.nabla_events_comment_reactions (
    id              TEXT                    PRIMARY KEY,
    comment         TEXT                    NOT_NULL REFERENCES nablaweb_vue.nabla_events_comments(id),
    user            TEXT                    NOT NULL REFERENCES nablaweb_vue.nabla_users(username) ON UPDATE CASCADE ON DELETE CASCADE,
    reaction        TEXT                    NOT_NULL DEFAULT ''
    
)