import { axios, apiURL } from 'boot/axios'
import { Dark } from 'quasar'
import { ref } from 'vue'

const useHiveAccountRegex =
  /^(?=.{3,16}$)[a-z]([0-9a-z]|[0-9a-z-](?=[0-9a-z])){2,}([.](?=[a-z][0-9a-z-][0-9a-z-])[a-z]([0-9a-z]|[0-9a-z-](?=[0-9a-z])){1,}){0,}$/

export function useHiveAvatarRef({
  hiveAccname,
  size = 'medium',
  reason = 'v4vapp-web',
}) {
  console.log('useHiveAvatarRef', hiveAccname)
  const hiveAvatar = ref(
    useHiveAvatarURL({ hiveAccname: hiveAccname, size: size, reason: reason })
  )
  return hiveAvatar
}

export function useHiveAvatarURL({
  hiveAccname,
  size = 'medium',
  reason = 'v4vapp-web',
}) {
  // Uses the Hive.blog image service to get the avatar for a Hive account
  // Returns null if the hiveAccname is blank or not a valid name.
  if (!hiveAccname || !hiveAccname.match(useHiveAccountRegex)) {
    if (Dark.isActive) {
      return 'avatars/hive_logo_dark.svg'
    } else {
      return 'avatars/hive_logo_light.svg'
    }
  }
  console.log(apiURL + '/hive/avatar/' + hiveAccname + '/' + size)
  return (
    apiURL + '/hive/avatar/' + hiveAccname + '/' + size + '?reason=' + reason
  )
}

export async function useLoadHiveAvatar(hiveAccname) {
  const url = useHiveAvatarURL({ hiveAccname: hiveAccname, size: 'small' })
  try {
    const res = await axios({
      url: url,
      method: 'GET',
      responseType: 'blob',
    })
    console.log('useLoadHiveAvatar result', res)
    if (res.status === 200) {
      const retUrl = URL.createObjectURL(res.data)
      console.log('useLoadHiveAvatar retUrl', retUrl)
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

export async function useGetVestsHPConversion() {
  // returns the conversion rate between VESTS and HIVE Power
  try {
    const res = await hiveTx.call(
      'condenser_api.get_dynamic_global_properties',
      []
    )
    const result = res.result
    console.log('result', result)
    const totalVestingFundHive = parseFloat(
      result.total_vesting_fund_hive.split(' ')[0]
    )
    const totalVestingShares = parseFloat(
      result.total_vesting_shares.split(' ')[0]
    )

    // calculate the conversion rate
    const conversionRate = totalVestingFundHive / totalVestingShares

    // print the conversion rate
    console.log(`1 HIVE Power = ${conversionRate.toFixed(6)} VESTS`)
    return conversionRate
  } catch (error) {
    console.log(error)
  }
}
