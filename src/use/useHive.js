import { axios } from 'boot/axios'

export function useHiveAvatar(username, size = 'medium') {
  if (!username) {
    return 'avatars/unkown_hive_user.png'
  }
  if (username.length > 2) {
    const re =
      /^(?=.{3,16}$)[a-z]([0-9a-z]|[0-9a-z-](?=[0-9a-z])){2,}([.](?=[a-z][0-9a-z-][0-9a-z-])[a-z]([0-9a-z]|[0-9a-z-](?=[0-9a-z])){1,}){0,}$/
    const validName = username.match(re)
    if (validName) {
      return 'https://images.hive.blog/u/' + username + '/avatar/'+size
    } else {
      return ''
    }
  } else {
    return 'avatars/unkown_hive_user.png'
  }
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
    const res = await hiveTx.call('condenser_api.get_accounts', [[hiveAccname]])
    let postingJsonMetadata = JSON.parse(res.result[0].posting_json_metadata)
    postingJsonMetadata.profile['hive_accname'] = hiveAccname
    return postingJsonMetadata.profile
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
