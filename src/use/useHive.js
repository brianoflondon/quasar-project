import { axios, apiURL } from 'boot/axios'
import { Dark } from 'quasar'

const useHiveAccountRegex =
  /^(?=.{3,16}$)[a-z]([0-9a-z]|[0-9a-z-](?=[0-9a-z])){2,}([.](?=[a-z][0-9a-z-][0-9a-z-])[a-z]([0-9a-z]|[0-9a-z-](?=[0-9a-z])){1,}){0,}$/

export function useHiveAvatar(
  username,
  size = 'medium',
  reason = 'v4vapp-web'
) {
  // Used the Hive.blog image service to get the avatar for a Hive account
  // Returns null if the username is blank or not a valid name.
  if (!username || !username.match(useHiveAccountRegex)) {
    if (Dark.isActive) {
      return 'avatars/hive_logo_dark.svg'
    } else {
      return 'avatars/hive_logo_light.svg'
    }
  }
  console.log(apiURL + '/hive/avatar/' + username + '/' + size)
  return apiURL + '/hive/avatar/' + username + '/' + size + '?reason=' + reason
}

export async function useLoadHiveAvatar(username) {
  const url = useHiveAvatar(username)
  try {
    const res = await axios({
      url: url,
      method: 'GET',
      responseType: 'blob',
    })
    console.log('res', res)
    if (res.status === 200) {
      const retUrl = URL.createObjectURL(res.data)
      return retUrl
    } else {
      return 'avatars/unkown_hive_user.png'
    }
  } catch (err) {
    return 'avatars/unkown_hive_user.png'
  }
}

export async function useHiveProfile(hiveAccname) {
  try {
    if (!hiveAccname) {
      return null
    }
    let postingJsonMetadata = {}
    const res = await hiveTx.call('condenser_api.get_accounts', [[hiveAccname]])
    if (res.result[0]) {
      // resJson = JSON.parse(res.result[0])
      if (res.result[0]['posting_json_metadata']) {
        postingJsonMetadata = JSON.parse(res.result[0].posting_json_metadata)
        postingJsonMetadata.profile['hive_accname'] = hiveAccname
        postingJsonMetadata.profile.name = postingJsonMetadata.profile.name
          ? postingJsonMetadata.profile.name
          : hiveAccname
        return postingJsonMetadata.profile
      } else {
        return { name: hiveAccname, hive_accname: hiveAccname }
      }
    }
    console.log('no profile found')
  } catch (err) {
    console.log(err)
  }
}

export async function useLoadHiveAccountsReputation(val, maxAccounts = 6) {
  // search through Hive for accounts matching pattern val
  // return sortted by reputation
  if (val.length < 2) {
    return
  }
  try {
    const res = await hiveTx.call('condenser_api.get_account_reputations', [
      val,
      maxAccounts,
    ])
    const accounts = res.result.map((el) => el.account)
    return accounts
  } catch (error) {
    console.log(error)
  }
}
