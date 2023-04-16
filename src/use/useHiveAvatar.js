import { axios } from 'boot/axios'

export function useHiveAvatar(username) {
  if (username.length > 2) {
    const re =
      /^(?=.{3,16}$)[a-z]([0-9a-z]|[0-9a-z-](?=[0-9a-z])){2,}([.](?=[a-z][0-9a-z-][0-9a-z-])[a-z]([0-9a-z]|[0-9a-z-](?=[0-9a-z])){1,}){0,}$/
    const validName = username.match(re)
    if (validName) {
      return 'https://images.hive.blog/u/' + username + '/avatar'
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
      responseType: 'blob'
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
