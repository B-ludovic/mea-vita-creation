--
-- PostgreSQL database dump
--

\restrict fVC6c1fX1YFHNbKLHhmFE6fb3T1lqfAf7uhD2bbpQVmCU1Shrw78NGcbJXTZAiu

-- Dumped from database version 17.6 (Postgres.app)
-- Dumped by pg_dump version 17.6 (Postgres.app)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public."WishlistItem" DROP CONSTRAINT IF EXISTS "WishlistItem_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."WishlistItem" DROP CONSTRAINT IF EXISTS "WishlistItem_productId_fkey";
ALTER TABLE IF EXISTS ONLY public."Review" DROP CONSTRAINT IF EXISTS "Review_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."Review" DROP CONSTRAINT IF EXISTS "Review_productId_fkey";
ALTER TABLE IF EXISTS ONLY public."RefreshToken" DROP CONSTRAINT IF EXISTS "RefreshToken_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."Product" DROP CONSTRAINT IF EXISTS "Product_categoryId_fkey";
ALTER TABLE IF EXISTS ONLY public."ProductImage" DROP CONSTRAINT IF EXISTS "ProductImage_productId_fkey";
ALTER TABLE IF EXISTS ONLY public."Order" DROP CONSTRAINT IF EXISTS "Order_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."Order" DROP CONSTRAINT IF EXISTS "Order_addressId_fkey";
ALTER TABLE IF EXISTS ONLY public."OrderItem" DROP CONSTRAINT IF EXISTS "OrderItem_productId_fkey";
ALTER TABLE IF EXISTS ONLY public."OrderItem" DROP CONSTRAINT IF EXISTS "OrderItem_orderId_fkey";
ALTER TABLE IF EXISTS ONLY public."CartItem" DROP CONSTRAINT IF EXISTS "CartItem_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."CartItem" DROP CONSTRAINT IF EXISTS "CartItem_productId_fkey";
ALTER TABLE IF EXISTS ONLY public."Address" DROP CONSTRAINT IF EXISTS "Address_userId_fkey";
DROP INDEX IF EXISTS public."WishlistItem_userId_productId_key";
DROP INDEX IF EXISTS public."User_resetPasswordToken_key";
DROP INDEX IF EXISTS public."User_email_key";
DROP INDEX IF EXISTS public."User_emailVerificationToken_key";
DROP INDEX IF EXISTS public."RefreshToken_userId_idx";
DROP INDEX IF EXISTS public."RefreshToken_token_key";
DROP INDEX IF EXISTS public."PromoCode_code_key";
DROP INDEX IF EXISTS public."Product_slug_key";
DROP INDEX IF EXISTS public."Product_sku_key";
DROP INDEX IF EXISTS public."Order_stripePaymentIntentId_key";
DROP INDEX IF EXISTS public."Order_orderNumber_key";
DROP INDEX IF EXISTS public."Category_slug_key";
DROP INDEX IF EXISTS public."Category_name_key";
DROP INDEX IF EXISTS public."CartItem_userId_productId_key";
ALTER TABLE IF EXISTS ONLY public._prisma_migrations DROP CONSTRAINT IF EXISTS _prisma_migrations_pkey;
ALTER TABLE IF EXISTS ONLY public."WishlistItem" DROP CONSTRAINT IF EXISTS "WishlistItem_pkey";
ALTER TABLE IF EXISTS ONLY public."User" DROP CONSTRAINT IF EXISTS "User_pkey";
ALTER TABLE IF EXISTS ONLY public."Review" DROP CONSTRAINT IF EXISTS "Review_userId_productId_key";
ALTER TABLE IF EXISTS ONLY public."Review" DROP CONSTRAINT IF EXISTS "Review_pkey";
ALTER TABLE IF EXISTS ONLY public."RefreshToken" DROP CONSTRAINT IF EXISTS "RefreshToken_pkey";
ALTER TABLE IF EXISTS ONLY public."PromoCode" DROP CONSTRAINT IF EXISTS "PromoCode_pkey";
ALTER TABLE IF EXISTS ONLY public."Product" DROP CONSTRAINT IF EXISTS "Product_pkey";
ALTER TABLE IF EXISTS ONLY public."ProductImage" DROP CONSTRAINT IF EXISTS "ProductImage_pkey";
ALTER TABLE IF EXISTS ONLY public."Order" DROP CONSTRAINT IF EXISTS "Order_pkey";
ALTER TABLE IF EXISTS ONLY public."OrderItem" DROP CONSTRAINT IF EXISTS "OrderItem_pkey";
ALTER TABLE IF EXISTS ONLY public."ContactMessage" DROP CONSTRAINT IF EXISTS "ContactMessage_pkey";
ALTER TABLE IF EXISTS ONLY public."Category" DROP CONSTRAINT IF EXISTS "Category_pkey";
ALTER TABLE IF EXISTS ONLY public."CartItem" DROP CONSTRAINT IF EXISTS "CartItem_pkey";
ALTER TABLE IF EXISTS ONLY public."Address" DROP CONSTRAINT IF EXISTS "Address_pkey";
DROP TABLE IF EXISTS public._prisma_migrations;
DROP TABLE IF EXISTS public."WishlistItem";
DROP TABLE IF EXISTS public."User";
DROP TABLE IF EXISTS public."Review";
DROP TABLE IF EXISTS public."RefreshToken";
DROP TABLE IF EXISTS public."PromoCode";
DROP TABLE IF EXISTS public."ProductImage";
DROP TABLE IF EXISTS public."Product";
DROP TABLE IF EXISTS public."OrderItem";
DROP TABLE IF EXISTS public."Order";
DROP TABLE IF EXISTS public."ContactMessage";
DROP TABLE IF EXISTS public."Category";
DROP TABLE IF EXISTS public."CartItem";
DROP TABLE IF EXISTS public."Address";
DROP TYPE IF EXISTS public."UserRole";
DROP TYPE IF EXISTS public."OrderStatus";
DROP TYPE IF EXISTS public."DiscountType";
-- *not* dropping schema, since initdb creates it
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS '';


--
-- Name: DiscountType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."DiscountType" AS ENUM (
    'PERCENTAGE',
    'FIXED_AMOUNT'
);


--
-- Name: OrderStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."OrderStatus" AS ENUM (
    'PENDING',
    'PAID',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
    'REFUNDED',
    'PARTIALLY_REFUNDED'
);


--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."UserRole" AS ENUM (
    'CLIENT',
    'ADMIN'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Address; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Address" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    street text NOT NULL,
    city text NOT NULL,
    "postalCode" text NOT NULL,
    country text DEFAULT 'France'::text NOT NULL,
    phone text,
    "isDefault" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: CartItem; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."CartItem" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "productId" text NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Category; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Category" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    image text,
    "order" integer DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: ContactMessage; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ContactMessage" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    subject text,
    message text NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Order; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Order" (
    id text NOT NULL,
    "orderNumber" text NOT NULL,
    "userId" text,
    "addressId" text,
    status public."OrderStatus" DEFAULT 'PENDING'::public."OrderStatus" NOT NULL,
    subtotal double precision NOT NULL,
    "shippingCost" double precision DEFAULT 0 NOT NULL,
    "taxAmount" double precision DEFAULT 0 NOT NULL,
    "discountAmount" double precision DEFAULT 0 NOT NULL,
    "totalAmount" double precision NOT NULL,
    "stripePaymentIntentId" text,
    "promoCode" text,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "trackingNumber" text,
    "trackingUrl" text,
    carrier text,
    "shippedAt" timestamp(3) without time zone,
    "deliveredAt" timestamp(3) without time zone,
    "refundedAmount" double precision DEFAULT 0 NOT NULL
);


--
-- Name: OrderItem; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."OrderItem" (
    id text NOT NULL,
    "orderId" text NOT NULL,
    "productId" text NOT NULL,
    quantity integer NOT NULL,
    "unitPrice" double precision NOT NULL,
    "totalPrice" double precision NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Product; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Product" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    price double precision NOT NULL,
    "compareAtPrice" double precision,
    "categoryId" text NOT NULL,
    stock integer DEFAULT 0 NOT NULL,
    sku text,
    width double precision,
    height double precision,
    depth double precision,
    weight double precision,
    material text,
    color text,
    "metaTitle" text,
    "metaDescription" text,
    "isActive" boolean DEFAULT true NOT NULL,
    "isFeatured" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: ProductImage; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ProductImage" (
    id text NOT NULL,
    "productId" text NOT NULL,
    url text NOT NULL,
    alt text,
    "order" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: PromoCode; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PromoCode" (
    id text NOT NULL,
    code text NOT NULL,
    description text,
    "discountType" public."DiscountType" NOT NULL,
    "discountValue" double precision NOT NULL,
    "minOrderAmount" double precision,
    "maxUses" integer,
    "currentUses" integer DEFAULT 0 NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: RefreshToken; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."RefreshToken" (
    id text NOT NULL,
    token text NOT NULL,
    "userId" text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Review; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Review" (
    id text NOT NULL,
    "productId" text NOT NULL,
    "userId" text NOT NULL,
    rating integer NOT NULL,
    comment text,
    "isApproved" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: User; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    "firstName" text,
    "lastName" text,
    phone text,
    role public."UserRole" DEFAULT 'CLIENT'::public."UserRole" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "emailVerificationExpires" timestamp(3) without time zone,
    "emailVerificationToken" text,
    "isActive" boolean DEFAULT false NOT NULL,
    "resetPasswordExpires" timestamp(3) without time zone,
    "resetPasswordToken" text
);


--
-- Name: WishlistItem; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."WishlistItem" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "productId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- Data for Name: Address; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Address" (id, "userId", "firstName", "lastName", street, city, "postalCode", country, phone, "isDefault", "createdAt", "updatedAt") FROM stdin;
cmhrsvsbf0001s6h1lig75w7t	cmhq4nq9z0001s6u0w3s3a9mv	John	Doe	123 rue imaginaire	Sainte Rose	333777	France	06242424424	f	2025-11-09 14:20:08.857	2025-11-11 00:05:12.5
\.


--
-- Data for Name: CartItem; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."CartItem" (id, "userId", "productId", quantity, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Category" (id, name, slug, description, image, "order", "isActive", "createdAt", "updatedAt") FROM stdin;
cat3	Sac Cylindre	sac-cylindre	Design unique et original, nos sacs cylindres se démarquent par leur forme distinctive.	\N	0	t	2025-11-08 11:25:29.734	2025-11-08 11:25:29.734
cat4	Sac U	sac-u	Spacieux et élégant, le sac U est parfait pour toutes les occasions.	\N	0	t	2025-11-08 11:25:29.734	2025-11-08 11:25:29.734
cat1	Pochettes Unisexe	pochettes-unisexe	Élégantes et pratiques, nos pochettes s'adaptent à tous les styles.	\N	0	t	2025-11-08 11:25:29.734	2025-11-10 23:56:15.377
cat2	Porte-Carte	porte-carte	Compacts et raffinés, nos porte-cartes allient minimalisme et élégance.	\N	0	t	2025-11-08 11:25:29.734	2025-11-11 00:03:03.631
\.


--
-- Data for Name: ContactMessage; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ContactMessage" (id, name, email, subject, message, "isRead", "createdAt") FROM stdin;
\.


--
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Order" (id, "orderNumber", "userId", "addressId", status, subtotal, "shippingCost", "taxAmount", "discountAmount", "totalAmount", "stripePaymentIntentId", "promoCode", notes, "createdAt", "updatedAt", "trackingNumber", "trackingUrl", carrier, "shippedAt", "deliveredAt", "refundedAmount") FROM stdin;
cmhrjesus0005s67hyea95zpm	CMD-1762682099860-ETZKGUWGH	cmhq4nq9z0001s6u0w3s3a9mv	\N	PAID	79	0	0	0	79	pi_3SRN8DPeuyhGg7QD10j7PIrO	\N	\N	2025-11-09 01:08:47	2025-11-09 01:08:47	\N	\N	\N	\N	\N	0
cmhrjesuv0009s67huhxolsmi	CMD-1762682099863-0V7E7JOHQ	cmhq4nq9z0001s6u0w3s3a9mv	\N	PAID	28	0	0	0	28	pi_3SRM2JPeuyhGg7QD1SDosTJw	\N	\N	2025-11-08 23:58:56	2025-11-08 23:58:56	\N	\N	\N	\N	\N	0
cmhrjesuz000ds67hmlf0e11k	CMD-1762682099867-4U0E7T6WZ	cmhq4nq9z0001s6u0w3s3a9mv	\N	PAID	28	0	0	0	28	pi_3SRLwiPeuyhGg7QD0CeZkyB5	\N	\N	2025-11-08 23:53:07	2025-11-08 23:53:07	\N	\N	\N	\N	\N	0
cmhrjesv2000hs67hysp7ta6i	CMD-1762682099870-IW7TTIJHU	cmhq4nq9z0001s6u0w3s3a9mv	\N	PAID	28	0	0	0	28	pi_3SRLuJPeuyhGg7QD13X7mBZZ	\N	\N	2025-11-08 23:50:23	2025-11-08 23:50:23	\N	\N	\N	\N	\N	0
cmhrjesv4000ls67hhqv37zaj	CMD-1762682099872-RNR8SURWM	cmhq4nq9z0001s6u0w3s3a9mv	\N	PAID	28	0	0	0	28	pi_3SRLpfPeuyhGg7QD1tqB8oWw	\N	\N	2025-11-08 23:45:32	2025-11-08 23:45:32	\N	\N	\N	\N	\N	0
cmhrus1dm0001s6djf7luuu9u	CMD-1762701193209-I55Q3452X	cmhq4nq9z0001s6u0w3s3a9mv	cmhrsvsbf0001s6h1lig75w7t	PAID	28	0	0	0	28	pi_3SRaIlPeuyhGg7QD15E7Qyq7	\N	\N	2025-11-09 15:13:13.21	2025-11-09 15:13:13.21	\N	\N	\N	\N	\N	0
cmhsioi0k0001s6i8qasngre6	CMD-1762741338930-NH06OQCOW	cmhq4nq9z0001s6u0w3s3a9mv	cmhrsvsbf0001s6h1lig75w7t	PAID	95	0	0	0	95	pi_3SRkkHPeuyhGg7QD0GsZSak3	\N	\N	2025-11-10 02:22:18.931	2025-11-10 02:22:18.931	\N	\N	\N	\N	\N	0
cmi1rupfz0001itrdvr511y5x	CMD-1763300940622-W66G4B5JC	cmhq4nq9z0001s6u0w3s3a9mv	cmhrsvsbf0001s6h1lig75w7t	REFUNDED	379.2	0	0	0	379.2	pi_3SU6K6PeuyhGg7QD1N4ft2fK	\N	\N	2025-11-16 13:49:00.623	2025-11-17 02:05:01.717	1763300940622-	https://www.laposte.fr/outils/suivre-vos-envois?code=1763300940622	Colissimo	2025-11-16 21:13:15.675	\N	0
cmi1ph3r70001itnv1ft60181	CMD-1763296946755-VSC02VAEG	cmhq4nq9z0001s6u0w3s3a9mv	cmhrsvsbf0001s6h1lig75w7t	PARTIALLY_REFUNDED	314.1	0	0	0	314.1	pi_3SU5HhPeuyhGg7QD0yNju09h	\N	\N	2025-11-16 12:42:26.756	2025-11-17 02:11:28.968	\N	\N	\N	\N	\N	60
cmi07rss70001ithzfr5mcye3	CMD-1763206746485-F0SLQM3X2	cmhq4nq9z0001s6u0w3s3a9mv	cmhrsvsbf0001s6h1lig75w7t	SHIPPED	295	0	0	0	295	pi_3SThorPeuyhGg7QD1kriCu6F	\N	\N	2025-11-15 11:39:06.486	2025-11-15 12:14:51.655	1763206746485-F0SLQM3X2	\N	Colissimo	2025-11-15 12:14:51.654	\N	0
cmi0778ys0001itgtttlb4ffd	CMD-1763205787683-RISTLQDME	cmhq4nq9z0001s6u0w3s3a9mv	cmhrsvsbf0001s6h1lig75w7t	SHIPPED	823	0	0	0	823	pi_3SThZOPeuyhGg7QD1yZahjl6	\N	\N	2025-11-15 11:23:07.684	2025-11-15 19:50:32.638	1763205787683	https://www.laposte.fr/outils/suivre-vos-envois?code=1763205787683	Colissimo	2025-11-15 19:50:32.637	2025-11-15 12:41:42.828	0
cmi2j22qm0003itft29274l66	CMD-1763346634077-I3OXYBBX3	cmhq4nq9z0001s6u0w3s3a9mv	cmhrsvsbf0001s6h1lig75w7t	SHIPPED	179	0	0	0	179	pi_3SUID6PeuyhGg7QD1qKuQRws	\N	\N	2025-11-17 02:30:34.078	2025-11-17 02:35:56.959	1763346634077	https://www.laposte.fr/outils/suivre-vos-envois?code=1763346634077	Colissimo	2025-11-17 02:35:56.957	\N	0
cmht2ve8s0005s6b9pwqntgen	CMD-1762775252955-WUH7QYN2X	cmhq4nq9z0001s6u0w3s3a9mv	cmhrsvsbf0001s6h1lig75w7t	PROCESSING	95	0	0	0	95	pi_3SRtZHPeuyhGg7QD0KacY1X6	\N	\N	2025-11-10 11:47:32.956	2025-11-17 00:31:22.535	\N	\N	\N	\N	\N	0
cmhsiwcu50005s6i8ni0s67nq	CMD-1762741705467-I6WYUKDH1	cmhq4nq9z0001s6u0w3s3a9mv	cmhrsvsbf0001s6h1lig75w7t	PENDING	77	0	0	0	77	pi_3SRkqCPeuyhGg7QD1dGSiADR	\N	\N	2025-11-10 02:28:25.468	2025-11-17 00:31:30.8	\N	\N	\N	\N	\N	0
cmhrux3h20001s6lsc93eyuiu	CMD-1762701429205-8AM1BSDV3	cmhq4nq9z0001s6u0w3s3a9mv	cmhrsvsbf0001s6h1lig75w7t	CANCELLED	49	0	0	0	49	pi_3SRaMZPeuyhGg7QD07wunxSs	\N	\N	2025-11-09 15:17:09.206	2025-11-17 00:31:40.917	1762701429205	https://www.laposte.fr/outils/suivre-vos-envois?code=1762701429205	Colissimo	2025-11-15 13:07:32.195	\N	0
cmhrjesu20001s67hx18tib3t	CMD-1762682099832-L2CM94L1I	cmhq4nq9z0001s6u0w3s3a9mv	\N	REFUNDED	28	0	0	0	28	pi_3SRNfQPeuyhGg7QD1MMqPpJx	\N	\N	2025-11-09 01:43:13	2025-11-17 00:31:53.002	\N	\N	\N	\N	\N	0
\.


--
-- Data for Name: OrderItem; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."OrderItem" (id, "orderId", "productId", quantity, "unitPrice", "totalPrice", "createdAt") FROM stdin;
cmhrjesu20003s67hjt0eik5z	cmhrjesu20001s67hx18tib3t	prod-carte-1	1	28	28	2025-11-09 09:54:59.834
cmhrjesus0007s67ho3pp1juh	cmhrjesus0005s67hyea95zpm	prod-sac-u-6	1	79	79	2025-11-09 09:54:59.861
cmhrjesuv000bs67hwq8zb7i5	cmhrjesuv0009s67huhxolsmi	prod-carte-2	1	28	28	2025-11-09 09:54:59.864
cmhrjesuz000fs67hb8kiric3	cmhrjesuz000ds67hmlf0e11k	prod-carte-2	1	28	28	2025-11-09 09:54:59.867
cmhrjesv2000js67hv00qqxam	cmhrjesv2000hs67hysp7ta6i	prod-carte-2	1	28	28	2025-11-09 09:54:59.87
cmhrjesv4000ns67hof1vi3ob	cmhrjesv4000ls67hhqv37zaj	prod-carte-2	1	28	28	2025-11-09 09:54:59.873
cmhrus1dm0003s6dj8wjt8wes	cmhrus1dm0001s6djf7luuu9u	prod-carte-4	1	28	28	2025-11-09 15:13:13.21
cmhrux3h20003s6lsp0ma9qbc	cmhrux3h20001s6lsc93eyuiu	prod-pochette-2	1	49	49	2025-11-09 15:17:09.206
cmhsioi0k0003s6i8hyrnjltp	cmhsioi0k0001s6i8qasngre6	prod-cylindre-1	1	95	95	2025-11-10 02:22:18.931
cmhsiwcu50007s6i8le8nif2d	cmhsiwcu50005s6i8ni0s67nq	prod-carte-5	1	28	28	2025-11-10 02:28:25.468
cmhsiwcu50008s6i8sjk6tv0s	cmhsiwcu50005s6i8ni0s67nq	prod-pochette-3	1	49	49	2025-11-10 02:28:25.468
cmht2ve8s0007s6b9zqwpxl10	cmht2ve8s0005s6b9pwqntgen	prod-cylindre-3	1	95	95	2025-11-10 11:47:32.956
cmi0778ys0003itgtv24sa16z	cmi0778ys0001itgtttlb4ffd	prod-cylindre-1	1	349	349	2025-11-15 11:23:07.684
cmi0778ys0004itgtn5nuemyt	cmi0778ys0001itgtttlb4ffd	prod-sac-u-7	1	295	295	2025-11-15 11:23:07.684
cmi0778ys0005itgt0vtlmepk	cmi0778ys0001itgtttlb4ffd	prod-pochette-6	1	179	179	2025-11-15 11:23:07.684
cmi07rss70003ithzoovl78oy	cmi07rss70001ithzfr5mcye3	prod-sac-u-9	1	295	295	2025-11-15 11:39:06.486
cmi1ph3r70003itnve86zvl8a	cmi1ph3r70001itnv1ft60181	prod-cylindre-1	1	349	349	2025-11-16 12:42:26.756
cmi1rupfz0003itrdk6zi3d5w	cmi1rupfz0001itrdvr511y5x	prod-sac-u-3	1	295	295	2025-11-16 13:49:00.623
cmi1rupfz0004itrdef3sdzno	cmi1rupfz0001itrdvr511y5x	prod-pochette-7	1	179	179	2025-11-16 13:49:00.623
cmi2j22qm0005itft9bp89s2h	cmi2j22qm0003itft29274l66	prod-pochette-7	1	179	179	2025-11-17 02:30:34.078
\.


--
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Product" (id, name, slug, description, price, "compareAtPrice", "categoryId", stock, sku, width, height, depth, weight, material, color, "metaTitle", "metaDescription", "isActive", "isFeatured", "createdAt", "updatedAt") FROM stdin;
prod-sac-u-9	L'Arche Besace Festival	larche-besace-festival	Modèle Besace avec corps en cuir noir et rabat Wax géométrique	295	\N	cat4	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	2025-11-08 23:55:53.45	2025-11-16 22:31:31.729
prod-pochette-6	L'Artisan Azur	lartisan-azur	Design avec dragonne, cuir bleu lisse et liseré orange	179	\N	cat1	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	2025-11-08 23:55:53.455	2025-11-15 11:27:38.162
prod-carte-4	L'Éclat Fogo	leclat-fogo	Porte-carte en cuir noir et Wax orange/bleu	45	\N	cat2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	2025-11-08 23:55:53.454	2025-11-10 19:23:02.029
prod-sac-u-2	L'Arche Besace Mosaïque	larche-besace-mosaique	Modèle Besace avec corps beige et rabat Wax turquoise/jaune	295	\N	cat4	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	2025-11-08 23:55:53.45	2025-11-10 18:49:33.4
prod-pochette-1	L'Atlas Fogo	latlas-fogo	Design asymétrique gris avec tissu Wax orange et bleu	179	\N	cat1	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	2025-11-08 23:55:53.455	2025-11-17 02:27:43.471
prod-pochette-2	L'Atlas Solaire	latlas-solaire	Design asymétrique jaune vif et noir brillant	179	\N	cat1	10	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	2025-11-08 23:55:53.455	2025-11-17 02:28:00.128
prod-pochette-7	Le Cachet Ardoise	le-cachet-ardoise	Design avec bouton, tissu gris et bouton M central	179	\N	cat1	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	2025-11-08 23:55:53.455	2025-11-17 02:30:34.104
prod-sac-u-7	L'Arche Pochette Festival	larche-pochette-festival	Modèle Pochette entièrement recouvert de Wax géométrique rose/bleu/jaune	295	\N	cat4	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	2025-11-08 23:55:53.45	2025-11-15 11:28:04.74
prod-sac-u-5	L'Arche Pochette Dashiki	larche-pochette-dashiki	Modèle Pochette entièrement recouvert d'un motif Wax de style Dashiki	295	\N	cat4	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	2025-11-08 23:55:53.45	2025-11-10 18:56:01.184
prod-carte-1	L'Éclat Améthyste	leclat-amethyste	Porte-carte en cuir violet et Wax rose/blanc	45	\N	cat2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	2025-11-08 23:55:53.454	2025-11-10 23:37:25.63
prod-carte-2	L'Éclat Kente	leclat-kente	Porte-carte en cuir noir et bande de style Kente rouge, vert, jaune	45	\N	cat2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	2025-11-08 23:55:53.454	2025-11-10 19:16:21.159
prod-cylindre-1	Le Tambour Améthyste	le-tambour-amethyste	Cuir violet profond avec rabat au motif Wax géométrique rose, bleu et jaune	349	\N	cat3	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	2025-11-08 23:55:53.453	2025-11-16 12:42:26.791
prod-pochette-5	L'Artisan Ébène	lartisan-ebene	Design avec dragonne, cuir noir texturé et liseré tissu rayé	179	\N	cat1	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	2025-11-08 23:55:53.455	2025-11-10 23:52:28.911
prod-sac-u-8	L'Arche Pochette Fogo	larche-pochette-fogo	Modèle Pochette entièrement recouvert de Wax orange/bleu	295	\N	cat4	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	2025-11-08 23:55:53.45	2025-11-10 18:56:36.377
prod-pochette-4	L'Atlas Terre et Mer	latlas-terre-et-mer	Design asymétrique cuir brun et bleu marine	179	\N	cat1	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	2025-11-08 23:55:53.455	2025-11-10 19:17:12.158
prod-sac-u-1	L'Arche Besace Fogo	larche-besace-fogo	Modèle Besace avec corps gris et rabat Wax orange/bleu	295	\N	cat4	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	2025-11-08 23:55:53.45	2025-11-10 18:45:48.488
prod-sac-u-6	L'Arche Pochette Mosaïque	larche-pochette-mosaique	Modèle Pochette entièrement recouvert de Wax turquoise/jaune	295	\N	cat4	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	2025-11-08 23:55:53.45	2025-11-10 18:46:15.62
prod-sac-u-4	L'Arche Besace Cendré	larche-besace-cendre	Modèle Besace avec corps gris et rabat Wax orange/bleu	295	\N	cat4	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	2025-11-08 23:55:53.45	2025-11-10 18:47:54.896
prod-cylindre-2	Le Tambour Dune	le-tambour-dune	Cuir beige/crème à un rabat au motif Wax géométrique turquoise et orange	349	\N	cat3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	2025-11-08 23:55:53.453	2025-11-10 19:12:09.693
prod-cylindre-3	Le Tambour Océan	le-tambour-ocean	Cuir verni jaune vif et rabat en suède bleu roi, orné d'un motif de feuillage brodé	349	\N	cat3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	2025-11-08 23:55:53.453	2025-11-10 19:12:34.632
prod-cylindre-6	Le Tambour Mosaïque	le-tambour-mosaique	Motif Wax géométrique turquoise et orange, couvrant tout le corps du sac	349	\N	cat3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	2025-11-08 23:55:53.453	2025-11-10 19:13:25.832
prod-cylindre-5	Le Tambour Festival	le-tambour-festival	Motif Wax géométrique rose, bleu et jaune, couvrant tout le corps du sac	349	\N	cat3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	2025-11-08 23:55:53.453	2025-11-10 19:13:56.068
prod-cylindre-4	Le Tambour Solaire	le-tambour-solaire	Motif Wax soleil rose et bleu, posé sur une base en cuir verni jaune vif	349	\N	cat3	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	2025-11-08 23:55:53.453	2025-11-10 19:14:40.64
prod-carte-6	L'Éclat Mosaïque	leclat-mosaique	Porte-carte en cuir noir et Wax rouge/jaune/bleu	45	\N	cat2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	2025-11-08 23:55:53.454	2025-11-10 19:15:14.772
prod-carte-3	L'Éclat Olive	leclat-olive	Porte-carte en cuir vert olive et Wax jaune/vert	45	\N	cat2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	2025-11-08 23:55:53.454	2025-11-10 19:15:31.816
prod-carte-5	L'Éclat Solaire	leclat-solaire	Porte-carte en cuir noir et Wax jaune vif	45	\N	cat2	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	2025-11-08 23:55:53.454	2025-11-10 19:15:45.343
prod-sac-u-3	L'Arche Pochette Royale	larche-pochette-royale	Modèle Pochette avec corps en Wax multicolore et rabat en suède bleu roi	295	\N	cat4	2	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	2025-11-08 23:55:53.45	2025-11-16 13:49:00.665
prod-pochette-3	L'Atlas Urbain	latlas-urbain	Design asymétrique tissu gris chiné et cuir noir	179	\N	cat1	5	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	2025-11-08 23:55:53.455	2025-11-10 23:55:41.842
\.


--
-- Data for Name: ProductImage; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ProductImage" (id, "productId", url, alt, "order", "createdAt") FROM stdin;
img-sac-u-1	prod-sac-u-1	/images/sac-u/arche-besace-fogo-1.jpg	L'Arche Besace Fogo	0	2025-11-08 23:58:09.359
img-sac-u-2	prod-sac-u-2	/images/sac-u/arche-besace-mosaique-1.jpg	L'Arche Besace Mosaïque	0	2025-11-08 23:58:09.359
img-sac-u-3	prod-sac-u-3	/images/sac-u/arche-pochette-royale-1.jpg	L'Arche Pochette Royale	0	2025-11-08 23:58:09.359
img-sac-u-4	prod-sac-u-4	/images/sac-u/arche-besace-cendre-1.jpg	L'Arche Besace Cendré	0	2025-11-08 23:58:09.359
img-sac-u-5	prod-sac-u-5	/images/sac-u/arche-pochette-dashiki-1.jpg	L'Arche Pochette Dashiki	0	2025-11-08 23:58:09.359
img-sac-u-6	prod-sac-u-6	/images/sac-u/arche-pochette-mosaique-1.jpg	L'Arche Pochette Mosaïque	0	2025-11-08 23:58:09.359
img-sac-u-7	prod-sac-u-7	/images/sac-u/arche-pochette-festival-1.jpg	L'Arche Pochette Festival	0	2025-11-08 23:58:09.359
img-sac-u-8	prod-sac-u-8	/images/sac-u/arche-pochette-fogo-1.jpg	L'Arche Pochette Fogo	0	2025-11-08 23:58:09.359
img-sac-u-9	prod-sac-u-9	/images/sac-u/arche-besace-festival-1.jpg	L'Arche Besace Festival	0	2025-11-08 23:58:09.359
img-cylindre-1	prod-cylindre-1	/images/sac-cylindre/tambour-amethyste-1.jpg	Le Tambour Améthyste	0	2025-11-08 23:58:09.362
img-cylindre-2	prod-cylindre-2	/images/sac-cylindre/tambour-dune-1.jpg	Le Tambour Dune	0	2025-11-08 23:58:09.362
img-cylindre-3	prod-cylindre-3	/images/sac-cylindre/tambour-ocean-1.jpg	Le Tambour Océan	0	2025-11-08 23:58:09.362
img-cylindre-4	prod-cylindre-4	/images/sac-cylindre/tambour-solaire-1.jpg	Le Tambour Solaire	0	2025-11-08 23:58:09.362
img-cylindre-5	prod-cylindre-5	/images/sac-cylindre/tambour-festival-1.jpg	Le Tambour Festival	0	2025-11-08 23:58:09.362
img-cylindre-6	prod-cylindre-6	/images/sac-cylindre/tambour-mosaique-1.jpg	Le Tambour Mosaïque	0	2025-11-08 23:58:09.362
img-carte-1	prod-carte-1	/images/porte-carte/eclat-amethyste-1.jpg	L'Éclat Améthyste	0	2025-11-08 23:58:09.362
img-carte-2	prod-carte-2	/images/porte-carte/eclat-kente-1.jpg	L'Éclat Kente	0	2025-11-08 23:58:09.362
img-carte-3	prod-carte-3	/images/porte-carte/eclat-olive-1.jpg	L'Éclat Olive	0	2025-11-08 23:58:09.362
img-carte-4	prod-carte-4	/images/porte-carte/eclat-fogo-1.jpg	L'Éclat Fogo	0	2025-11-08 23:58:09.362
img-carte-5	prod-carte-5	/images/porte-carte/eclat-solaire-1.jpg	L'Éclat Solaire	0	2025-11-08 23:58:09.362
img-carte-6	prod-carte-6	/images/porte-carte/eclat-mosaique-1.jpg	L'Éclat Mosaïque	0	2025-11-08 23:58:09.362
img-pochette-1	prod-pochette-1	/images/pochettes-unisexe/atlas-fogo-1.jpg	L'Atlas Fogo	0	2025-11-08 23:58:09.363
img-pochette-2	prod-pochette-2	/images/pochettes-unisexe/atlas-solaire-1.jpg	L'Atlas Solaire	0	2025-11-08 23:58:09.363
img-pochette-3	prod-pochette-3	/images/pochettes-unisexe/atlas-urbain-1.jpg	L'Atlas Urbain	0	2025-11-08 23:58:09.363
img-pochette-4	prod-pochette-4	/images/pochettes-unisexe/atlas-terre-et-mer-1.jpg	L'Atlas Terre et Mer	0	2025-11-08 23:58:09.363
img-pochette-5	prod-pochette-5	/images/pochettes-unisexe/artisan-ebene-1.jpg	L'Artisan Ébène	0	2025-11-08 23:58:09.363
img-pochette-6	prod-pochette-6	/images/pochettes-unisexe/artisan-azur-1.jpg	L'Artisan Azur	0	2025-11-08 23:58:09.363
img-pochette-7	prod-pochette-7	/images/pochettes-unisexe/cachet-ardoise-1.jpg	Le Cachet Ardoise	0	2025-11-08 23:58:09.363
cmht2ny7l0003s6b9ec9gtqhi	prod-pochette-1	/images/products/1762774905581-136795619-img-5729.JPG	L'Atlas Fogo	1	2025-11-10 11:41:45.585
cmhthmxik0001s62jfrwcw5sd	prod-cylindre-2	/images/products/1762800052262-77206416-img-5631.JPG	Le Tambour Dune	1	2025-11-10 18:40:52.268
cmhtho1ov0003s62j3u49i9bm	prod-cylindre-1	/images/products/1762800104331-542930498-img-5672.JPG	Le Tambour Améthyste	1	2025-11-10 18:41:44.335
cmhthp0h10005s62j3xs4prs9	prod-cylindre-3	/images/products/1762800149409-271611555-img-5639.JPG	Le Tambour Océan	1	2025-11-10 18:42:29.413
cmhthvqe80007s62jkicbf3gq	prod-sac-u-4	/images/products/1762800462940-855632911-img-5158.JPG	L'Arche Besace Cendré	1	2025-11-10 18:47:42.945
cmhthxtxy0009s62j3wmeoo0f	prod-sac-u-2	/images/products/1762800560850-797147551-img-5017.JPG	L'Arche Besace Mosaïque	1	2025-11-10 18:49:20.854
cmhthy10q000bs62jmggcffyz	prod-sac-u-2	/images/products/1762800570022-47453416-img-5190-2.JPG	L'Arche Besace Mosaïque	2	2025-11-10 18:49:30.027
cmhthzk9i000ds62jxo2h40p7	prod-sac-u-9	/images/products/1762800641583-915743967-img-5178.JPG	L'Arche Besace Festival	1	2025-11-10 18:50:41.622
cmhti5f6a000fs62j3ccsp8kx	prod-sac-u-7	/images/products/1762800914958-128668520-img-5202.JPG	L'Arche Pochette Festival	1	2025-11-10 18:55:14.963
cmhti6vjv000hs62jyrc6b0xy	prod-sac-u-8	/images/products/1762800982839-961009173-img-5144.JPG	L'Arche Pochette Fogo	1	2025-11-10 18:56:22.844
cmhti71ds000js62jl6zysk11	prod-sac-u-8	/images/products/1762800990397-814052823-img-5207.JPG	L'Arche Pochette Fogo	2	2025-11-10 18:56:30.4
\.


--
-- Data for Name: PromoCode; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."PromoCode" (id, code, description, "discountType", "discountValue", "minOrderAmount", "maxUses", "currentUses", "startDate", "endDate", "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: RefreshToken; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."RefreshToken" (id, token, "userId", "expiresAt", "createdAt") FROM stdin;
cmi27iy0q0003it7i0p0vw1uz	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWhxNG5xOXowMDAxczZ1MHczczNhOW12IiwiaWF0IjoxNzYzMzI3MjY1LCJleHAiOjE3NjM5MzIwNjV9.tnPS6nMsr_jogZnCDguL5ZPhbEs4_iOfwKP8Wj6AaTk	cmhq4nq9z0001s6u0w3s3a9mv	2025-11-23 21:07:45.721	2025-11-16 21:07:45.722
cmi28f9460005it7itc90gf1w	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWhxNG5xOXowMDAxczZ1MHczczNhOW12IiwiaWF0IjoxNzYzMzI4NzczLCJleHAiOjE3NjM5MzM1NzN9.fxRL4jHn2v5VXhJqu5hyuX9mPK3GsC0glV2tdmJ1CF0	cmhq4nq9z0001s6u0w3s3a9mv	2025-11-23 21:32:53.094	2025-11-16 21:32:53.094
cmi28iyhs0007it7iofww5764	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWhxNG5xOXowMDAxczZ1MHczczNhOW12IiwiaWF0IjoxNzYzMzI4OTQ1LCJleHAiOjE3NjM5MzM3NDV9.WSLsBXa1Luxb5JcWsWDOQNd5kt50RnqPl1dmsngOR_M	cmhq4nq9z0001s6u0w3s3a9mv	2025-11-23 21:35:45.952	2025-11-16 21:35:45.953
cmi28l4jc0009it7i6odbfkfb	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWhxNG5xOXowMDAxczZ1MHczczNhOW12IiwiaWF0IjoxNzYzMzI5MDQ3LCJleHAiOjE3NjM5MzM4NDd9.EX8XvW-KCcz08378Y6bdsTOI14nfZ_NrYfNhoujCn5c	cmhq4nq9z0001s6u0w3s3a9mv	2025-11-23 21:37:27.096	2025-11-16 21:37:27.096
cmi28n1z1000bit7i77yd8n0e	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWhxNG5xOXowMDAxczZ1MHczczNhOW12IiwiaWF0IjoxNzYzMzI5MTM3LCJleHAiOjE3NjM5MzM5Mzd9.iGRPiHMJToB_M9BOjzz5LtiIVit2MY5WGXV_iFUqqBk	cmhq4nq9z0001s6u0w3s3a9mv	2025-11-23 21:38:57.085	2025-11-16 21:38:57.085
cmi28nrvr000dit7i6qrmfbzq	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWhxNG5xOXowMDAxczZ1MHczczNhOW12IiwiaWF0IjoxNzYzMzI5MTcwLCJleHAiOjE3NjM5MzM5NzB9.1s32ffEXzYZ3RMB8ZFlGCU_yq3GgNKMnsrxw0qsIj4U	cmhq4nq9z0001s6u0w3s3a9mv	2025-11-23 21:39:30.663	2025-11-16 21:39:30.664
cmi292gyo000fit7isuze9agd	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWhxNG5xOXowMDAxczZ1MHczczNhOW12IiwiaWF0IjoxNzYzMzI5ODU2LCJleHAiOjE3NjM5MzQ2NTZ9.pMz6ayE_HK1c7DOBY4Y2sUfKl9uAGr3m0KMX-If2GwM	cmhq4nq9z0001s6u0w3s3a9mv	2025-11-23 21:50:56.352	2025-11-16 21:50:56.352
cmi29awvz000hit7i9r37er8m	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWhxNG5xOXowMDAxczZ1MHczczNhOW12IiwiaWF0IjoxNzYzMzMwMjUwLCJleHAiOjE3NjM5MzUwNTB9.AFR8HH9Lioqr1Nr2CEP_-b3xia86HL6G4bFkTGvrrMs	cmhq4nq9z0001s6u0w3s3a9mv	2025-11-23 21:57:30.238	2025-11-16 21:57:30.239
cmi29zj3a000jit7i3pi1gls7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWhxNG5xOXowMDAxczZ1MHczczNhOW12IiwiaWF0IjoxNzYzMzMxMzk4LCJleHAiOjE3NjM5MzYxOTh9.7RbO4Y-Xf-6Asiv1CJV895fGphA4jTb4qMLVBmfILSk	cmhq4nq9z0001s6u0w3s3a9mv	2025-11-23 22:16:38.758	2025-11-16 22:16:38.759
cmi2ao5zk0001it0d0tmu2pwr	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWhxNG5xOXowMDAxczZ1MHczczNhOW12IiwiaWF0IjoxNzYzMzMyNTQ4LCJleHAiOjE3NjM5MzczNDh9.DgMRLMJuxIg9Qd-bySa4srhQNpqxCeyw1bKMV4kYe-M	cmhq4nq9z0001s6u0w3s3a9mv	2025-11-23 22:35:48.175	2025-11-16 22:35:48.176
cmi2bd3fr0001itwientz8e24	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWhxNG5xOXowMDAxczZ1MHczczNhOW12IiwiaWF0IjoxNzYzMzMzNzExLCJleHAiOjE3NjM5Mzg1MTF9.Ctwqthg5XEdpt5-xuaGXJObJ1XkNeqPA5frYMgVBAXc	cmhq4nq9z0001s6u0w3s3a9mv	2025-11-23 22:55:11.271	2025-11-16 22:55:11.272
cmi2e9i720001itadr7wtt4hs	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWhxNG5xOXowMDAxczZ1MHczczNhOW12IiwiaWF0IjoxNzYzMzM4NTgyLCJleHAiOjE3NjM5NDMzODJ9.acXVAPCGo6yx70g7mQwcsxJSmke2h7F46NTzxjajgQI	cmhq4nq9z0001s6u0w3s3a9mv	2025-11-24 00:16:22.621	2025-11-17 00:16:22.622
cmi2em1yq0001itxkma8hskjf	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWhxNG5xOXowMDAxczZ1MHczczNhOW12IiwiaWF0IjoxNzYzMzM5MTY4LCJleHAiOjE3NjM5NDM5Njh9.o2Ofb9KyBrA2uYKmm1LREdTMJw_sdsEr1lPxX4w_LPc	cmhq4nq9z0001s6u0w3s3a9mv	2025-11-24 00:26:08.114	2025-11-17 00:26:08.115
cmi2fid8g0001it26pqx2cu7m	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWhxNG5xOXowMDAxczZ1MHczczNhOW12IiwiaWF0IjoxNzYzMzQwNjc1LCJleHAiOjE3NjM5NDU0NzV9.S2Ci1pv7t3jJb_mY_QKcSvj1ZmmPMCYdREAFI1NzdfU	cmhq4nq9z0001s6u0w3s3a9mv	2025-11-24 00:51:15.712	2025-11-17 00:51:15.713
cmi2gftdw0001itc8f7uhhosx	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWhxNG5xOXowMDAxczZ1MHczczNhOW12IiwiaWF0IjoxNzYzMzQyMjM2LCJleHAiOjE3NjM5NDcwMzZ9.jfbtNAtYTGVIF-k2oVXYkMdxdkjnn8O6ZyrTVlpDE1w	cmhq4nq9z0001s6u0w3s3a9mv	2025-11-24 01:17:16.291	2025-11-17 01:17:16.292
cmi2h7xgk0001itvsr7f1cy4f	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWhxNG5xOXowMDAxczZ1MHczczNhOW12IiwiaWF0IjoxNzYzMzQzNTQ3LCJleHAiOjE3NjM5NDgzNDd9._7R7MjnJMKHyfmsFBDxi9htuakHNq2AG_F9juMzOYhE	cmhq4nq9z0001s6u0w3s3a9mv	2025-11-24 01:39:07.94	2025-11-17 01:39:07.94
cmi2hxgso0003itvs28n9zmnp	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWhxNG5xOXowMDAxczZ1MHczczNhOW12IiwiaWF0IjoxNzYzMzQ0NzM5LCJleHAiOjE3NjM5NDk1Mzl9.vPQrGjGRgBv-40W7YkdwUI1mlE-p5NRa1KWbtcN_E-A	cmhq4nq9z0001s6u0w3s3a9mv	2025-11-24 01:58:59.4	2025-11-17 01:58:59.401
cmi2ix4ul0001itft9j2cib9q	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWhxNG5xOXowMDAxczZ1MHczczNhOW12IiwiaWF0IjoxNzYzMzQ2NDAzLCJleHAiOjE3NjM5NTEyMDN9.dd14AbCYQmfH6EdWusObG3w0yoR0qfmQpAc1j6I9Whg	cmhq4nq9z0001s6u0w3s3a9mv	2025-11-24 02:26:43.532	2025-11-17 02:26:43.533
cmi2kwplu0001itq3pld3icf1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWhxNG5xOXowMDAxczZ1MHczczNhOW12IiwiaWF0IjoxNzYzMzQ5NzQzLCJleHAiOjE3NjM5NTQ1NDN9.edHFcY65-V1uXWWMlq9WW92jVU8GVgv0wIyftt8MnN0	cmhq4nq9z0001s6u0w3s3a9mv	2025-11-24 03:22:23.01	2025-11-17 03:22:23.011
\.


--
-- Data for Name: Review; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Review" (id, "productId", "userId", rating, comment, "isApproved", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."User" (id, email, password, "firstName", "lastName", phone, role, "createdAt", "updatedAt", "emailVerificationExpires", "emailVerificationToken", "isActive", "resetPasswordExpires", "resetPasswordToken") FROM stdin;
cmhrvilj30000s6xprq4kba0h	auparavant24_indique@icloud.com	$2b$10$lSOkmqAE3bisuNbQFRrDjeocHizv4DlD7NH9e3i/Y6QtSP1IoNt3K	Antoine	Vosges	\N	CLIENT	2025-11-09 15:33:52.383	2025-11-10 15:26:39.876	\N	\N	t	2025-11-10 16:26:39.875	a96bde5fc87079b1b470b4aa994fc5b9395878251aec270a50e102c199751780
cmhq4nq9z0001s6u0w3s3a9mv	timboo974@gmail.com	$2b$10$VygvFChYfMnKFdwFKqiPLOt/Voo.TNBfQxbxpsYMWSoDCk9qzZLYa	Ludovic	BATAILLE	\N	ADMIN	2025-11-08 10:14:16.008	2025-11-10 15:37:19.36	\N	\N	t	2025-11-10 16:37:19.359	7dd04b01c8cd0e95c9da831e5c1617847e59116234dd9f17d8a6fa5c35c1f69e
cmhq4jbl40000s6u0siqkgfyf	ludo@francois.maroquinerie.com	$2b$10$8B8Z1cujmr1d3YQecve8Re66sA8cokn40FnADQiW5OodfNI/XIAuG	Ludovic	Vosges	\N	CLIENT	2025-11-08 10:10:50.345	2025-11-10 19:35:41.678	\N	\N	t	\N	\N
cmhp18u3n0000s6n1a5rw32wy	test@exemple.com	$2b$10$EynkkP8VAuytDTTuLv80KOrW5yDqijQu1eFzhrUY8k5tTjR8fbKwe	Jean	Dupont	\N	CLIENT	2025-11-07 15:50:56.1	2025-11-11 00:03:18.558	\N	\N	t	\N	\N
cmhsbiu4b0000s690m0ldgp0c	ludovic.bataille@icloud.com	$2b$10$.OFtWQxmZqy68ExLLpAn8.Eva/Ur40aa2tj3pT5nkNSRKMIreCKFq	Nala	VOSGES	\N	CLIENT	2025-11-09 23:01:57.371	2025-11-16 22:28:31.608	\N	\N	t	\N	\N
\.


--
-- Data for Name: WishlistItem; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."WishlistItem" (id, "userId", "productId", "createdAt") FROM stdin;
cmi07v6730005ithz6uyfwkb8	cmhq4nq9z0001s6u0w3s3a9mv	prod-carte-1	2025-11-15 11:41:43.839
cmi0y51wo0001itwgnpdbb1il	cmhq4nq9z0001s6u0w3s3a9mv	prod-cylindre-1	2025-11-15 23:57:14.856
cmi1qllpb0001it5x0o45ango	cmhq4nq9z0001s6u0w3s3a9mv	prod-cylindre-2	2025-11-16 13:13:56.256
cmi1qmidp0003it5x8bk8xvg1	cmhq4nq9z0001s6u0w3s3a9mv	prod-pochette-7	2025-11-16 13:14:38.605
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
3e076d2d-1de0-4b45-b60b-58c50e396f9d	bc8ba363677513c4452342ec04ff0a5fb865c2fde5b8405b0541fe0eec814ace	2025-11-07 16:44:15.782521+01	20251107154415_init_with_default_ids	\N	\N	2025-11-07 16:44:15.759842+01	1
\.


--
-- Name: Address Address_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Address"
    ADD CONSTRAINT "Address_pkey" PRIMARY KEY (id);


--
-- Name: CartItem CartItem_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CartItem"
    ADD CONSTRAINT "CartItem_pkey" PRIMARY KEY (id);


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- Name: ContactMessage ContactMessage_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ContactMessage"
    ADD CONSTRAINT "ContactMessage_pkey" PRIMARY KEY (id);


--
-- Name: OrderItem OrderItem_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_pkey" PRIMARY KEY (id);


--
-- Name: Order Order_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_pkey" PRIMARY KEY (id);


--
-- Name: ProductImage ProductImage_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductImage"
    ADD CONSTRAINT "ProductImage_pkey" PRIMARY KEY (id);


--
-- Name: Product Product_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_pkey" PRIMARY KEY (id);


--
-- Name: PromoCode PromoCode_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PromoCode"
    ADD CONSTRAINT "PromoCode_pkey" PRIMARY KEY (id);


--
-- Name: RefreshToken RefreshToken_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."RefreshToken"
    ADD CONSTRAINT "RefreshToken_pkey" PRIMARY KEY (id);


--
-- Name: Review Review_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_pkey" PRIMARY KEY (id);


--
-- Name: Review Review_userId_productId_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_userId_productId_key" UNIQUE ("userId", "productId");


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: WishlistItem WishlistItem_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."WishlistItem"
    ADD CONSTRAINT "WishlistItem_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: CartItem_userId_productId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "CartItem_userId_productId_key" ON public."CartItem" USING btree ("userId", "productId");


--
-- Name: Category_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Category_name_key" ON public."Category" USING btree (name);


--
-- Name: Category_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Category_slug_key" ON public."Category" USING btree (slug);


--
-- Name: Order_orderNumber_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Order_orderNumber_key" ON public."Order" USING btree ("orderNumber");


--
-- Name: Order_stripePaymentIntentId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Order_stripePaymentIntentId_key" ON public."Order" USING btree ("stripePaymentIntentId");


--
-- Name: Product_sku_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Product_sku_key" ON public."Product" USING btree (sku);


--
-- Name: Product_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Product_slug_key" ON public."Product" USING btree (slug);


--
-- Name: PromoCode_code_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "PromoCode_code_key" ON public."PromoCode" USING btree (code);


--
-- Name: RefreshToken_token_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "RefreshToken_token_key" ON public."RefreshToken" USING btree (token);


--
-- Name: RefreshToken_userId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "RefreshToken_userId_idx" ON public."RefreshToken" USING btree ("userId");


--
-- Name: User_emailVerificationToken_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_emailVerificationToken_key" ON public."User" USING btree ("emailVerificationToken");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_resetPasswordToken_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_resetPasswordToken_key" ON public."User" USING btree ("resetPasswordToken");


--
-- Name: WishlistItem_userId_productId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "WishlistItem_userId_productId_key" ON public."WishlistItem" USING btree ("userId", "productId");


--
-- Name: Address Address_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Address"
    ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CartItem CartItem_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CartItem"
    ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CartItem CartItem_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CartItem"
    ADD CONSTRAINT "CartItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrderItem OrderItem_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrderItem OrderItem_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Order Order_addressId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES public."Address"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Order Order_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ProductImage ProductImage_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProductImage"
    ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Product Product_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: RefreshToken RefreshToken_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."RefreshToken"
    ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Review Review_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Review Review_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: WishlistItem WishlistItem_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."WishlistItem"
    ADD CONSTRAINT "WishlistItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: WishlistItem WishlistItem_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."WishlistItem"
    ADD CONSTRAINT "WishlistItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict fVC6c1fX1YFHNbKLHhmFE6fb3T1lqfAf7uhD2bbpQVmCU1Shrw78NGcbJXTZAiu

