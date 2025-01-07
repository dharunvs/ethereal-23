CREATE TABLE public.config (
    role text NOT NULL,
    pause_payments boolean NOT NULL
);

CREATE TABLE public.events (
    event_id character varying(255) PRIMARY KEY NOT NULL,
    name character varying(255) NOT NULL,
    mode character varying(255) NOT NULL,
    min integer NOT NULL,
    max integer NOT NULL,
    inner_teams text[],
    outer_teams text[],
    coordinator text,
    phone text
);

CREATE TABLE public.fees (
    ethereal integer NOT NULL,
    ic_combo_concert integer NOT NULL,
    oc_combo integer NOT NULL,
    ic_concert integer NOT NULL,
    oc_concert integer NOT NULL,
    ic_both integer NOT NULL
);

CREATE TABLE public.qr (
    code text PRIMARY KEY NOT NULL,
    name text NOT NULL,
    last_scanned text[]
);

CREATE TABLE public.teams (
    id character varying(255) PRIMARY KEY NOT NULL,
    name character varying(255) NOT NULL,
    college character varying(255) NOT NULL,
    event character varying(255) NOT NULL,
    lead character varying(255) NOT NULL,
    members character varying(255)[]
);

CREATE TABLE public.transactions (
    transaction_id text PRIMARY KEY NOT NULL,
    user_id character varying(255),
    type character varying(25)
);

CREATE TABLE public.transactions_done (
    t_id text PRIMARY KEY NOT NULL,
    user_id character varying(255) NOT NULL,
    type character varying(25) NOT NULL
);

CREATE TABLE public.transactions_not_done (
    t_id text PRIMARY KEY NOT NULL,
    user_id character varying(255) NOT NULL,
    type character varying(25) NOT NULL
);

CREATE TABLE public.transactions_verified (
    t_id text PRIMARY KEY NOT NULL,
    user_id character varying(255) NOT NULL,
    type character varying(25) NOT NULL
);

CREATE TABLE public.users (
    id character varying(255) PRIMARY KEY NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL UNIQUE,
    phone character varying(15),
    ethereal character varying(50),
    concert character varying(50),
    combo_eligible boolean,
    logged_in boolean,
    otp character varying(10),
    college character varying(255),
    concert_code character varying(255),
    first_year boolean
);
