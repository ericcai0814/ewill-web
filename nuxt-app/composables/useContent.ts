// nuxt-app/composables/useContent.ts
import { ref, onMounted } from 'vue'
import type { Ref } from 'vue'

// Define interfaces for our data structures to get type safety
interface Asset {
  id: string;
  original_path: string;
  normalized_path: string;
  alt: string;
  variants?: { [key: string]: string };
}

interface AssetManifest {
  assets: Asset[];
}

export const useContent = <T>(pageName: string) => {
  const pageContent: Ref<T | null> = ref(null)
  const assetManifest: Ref<AssetManifest | null> = ref(null)
  const error: Ref<Error | null> = ref(null)
  const loading: Ref<boolean> = ref(true)

  const fetchContent = async () => {
    loading.value = true
    error.value = null
    try {
      // In Nuxt 3, server-side fetches inside onMounted or client-side navigation
      // should use useFetch or $fetch. We'll use $fetch for this composable.
      const [content, assets] = await Promise.all([
        $fetch(`/content/pages/${pageName}.json`),
        $fetch('/asset-manifest.json')
      ])
      pageContent.value = content as T
      assetManifest.value = assets as AssetManifest
    } catch (e: any) {
      error.value = e
      console.error(`Failed to fetch content for ${pageName}:`, e)
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchContent)

  // Helper function to find an asset by its ID
  const findAssetById = (id: string): Asset | undefined => {
    return assetManifest.value?.assets.find(asset => asset.id === id)
  }

  return {
    pageContent,
    assetManifest,
    findAssetById,
    error,
    loading,
    fetchContent, // Expose fetchContent to allow manual refetching if needed
  }
}
