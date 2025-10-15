<script lang="ts">
	/**
	 * MetaHead Component
	 *
	 * A reusable component for managing page metadata including title, description,
	 * and SEO-related meta tags.
	 *
	 * @example
	 * <MetaHead
	 *   title="Login"
	 *   description="Login to your account"
	 *   noIndex={true}
	 * />
	 */
	interface Props {
		/** Page title that appears in browser tab */
		title: string;
		/** Page description for SEO */
		description?: string;
		/** Custom robots directive (default: 'index, follow') */
		robots?: string;
		/** Shorthand to set robots to 'noindex, nofollow' */
		noIndex?: boolean;
		/** Additional keywords for SEO (optional) */
		keywords?: string;
		/** Canonical URL for the page */
		canonical?: string;
		/** Open Graph title (defaults to title if not provided) */
		ogTitle?: string;
		/** Open Graph description (defaults to description if not provided) */
		ogDescription?: string;
		/** Open Graph image URL */
		ogImage?: string;
		/** Twitter card type (default: 'summary_large_image') */
		twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
	}

	let {
		title,
		description,
		robots = 'index, follow',
		noIndex = false,
		keywords,
		canonical,
		ogTitle,
		ogDescription,
		ogImage,
		twitterCard = 'summary_large_image'
	}: Props = $props();

	let robotsContent = $derived(noIndex ? 'noindex, nofollow' : robots);
	let openGraphTitle = $derived(ogTitle || title);
	let openGraphDescription = $derived(ogDescription || description);
</script>

<svelte:head>
	<!-- Basic Meta Tags -->
	<title>{title}</title>
	{#if description}
		<meta name="description" content={description} />
	{/if}
	{#if keywords}
		<meta name="keywords" content={keywords} />
	{/if}
	<meta name="robots" content={robotsContent} />

	<!-- Canonical URL -->
	{#if canonical}
		<link rel="canonical" href={canonical} />
	{/if}

	<!-- Open Graph Meta Tags -->
	<meta property="og:title" content={openGraphTitle} />
	{#if openGraphDescription}
		<meta property="og:description" content={openGraphDescription} />
	{/if}
	{#if ogImage}
		<meta property="og:image" content={ogImage} />
	{/if}
	<meta property="og:type" content="website" />

	<!-- Twitter Card Meta Tags -->
	<meta name="twitter:card" content={twitterCard} />
	<meta name="twitter:title" content={openGraphTitle} />
	{#if openGraphDescription}
		<meta name="twitter:description" content={openGraphDescription} />
	{/if}
	{#if ogImage}
		<meta name="twitter:image" content={ogImage} />
	{/if}
</svelte:head>
