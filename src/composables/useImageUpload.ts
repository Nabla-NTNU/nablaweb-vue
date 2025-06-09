import { ref, Ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'

async function uploadFile(file: File, filepath: string, bucketName: string, uploading: Ref<boolean|null>, error: Ref<string|null>, publicURL: Ref<string|null>) {
    uploading.value = true
    error.value = null
    const { data, error: uploadError } = await supabase
        .storage
        .from(bucketName)
        .upload(filepath, file)

    if (uploadError) {
        error.value = uploadError.message
        uploading.value = false
        return null
    }

    const { data: urlData } = supabase
        .storage
        .from(bucketName)
        .getPublicUrl(filepath)

    publicURL.value = urlData.publicUrl
    uploading.value = false
    return publicURL.value
}

export function useGroupImageUpload(groupURL: string,) {
    const uploading = ref(false)
    const error = ref<string|null>(null)
    const publicURL = ref<string|null>(null)

    async function upload(file: File) {
        const date: Date = new Date()
        const fileExtention = file.name.split('.').pop()
        const filepath = `group-images/${groupURL}/${date.toISOString()}.${fileExtention}`

        return uploadFile(file, filepath, 'images', uploading, error, publicURL)
    }

    return { uploading, error, publicURL, upload }
}
