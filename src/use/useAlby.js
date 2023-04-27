import { useMeta } from 'quasar'
import { useHiveAvatarURL, useHiveProfile } from './useHive'

export async function useSetAlbyMeta(hiveAccname) {
  // add Meta tags for Alby

  console.log('alby')
  const hiveProfile = await useHiveProfile(hiveAccname)
  const albyNameContent = hiveProfile ? hiveProfile.name : hiveAccname
  console.log('albyNameContent', albyNameContent)
  const albyImageContent = useHiveAvatarURL({
    hiveAccname: hiveAccname,
    reason: 'alby',
  })
  console.log('albyImageContent', albyImageContent)
  const albyLightningContent = `${hiveAccname}@v4v.app`
  const metaData = {
    meta: {
      albyName: {
        name: 'alby:name',
        content: albyNameContent,
      },
      albyImage: {
        name: 'alby:image',
        content: albyImageContent,
      },
      property: {
        name: 'lightning',
        content: albyLightningContent,
      },
      description: {
        name: 'description',
        content: `Hive User ${hiveAccname} is using V4V.app`,
      },
    },
  }
  useMeta(metaData)
}
