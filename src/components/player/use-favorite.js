// 收藏功能的实现
import { useStore } from 'vuex'
import { computed } from 'vue'
import { remove, save } from '@/assets/js/array-store'
import { FAVORITE_KEY } from '@/assets/js/constant'

export default function useFavorite () {
  // data
  const maxLen = 100 // 收藏歌曲数组最大长度

  // vuex
  const store = useStore()
  const favoriteList = computed(() => store.state.favoriteList) // 收藏歌曲数组

  // methods
  // 收藏图标样式
  function getFavoriteIcon (song) {
    return isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite'
  }

  // 点击收藏按钮
  function toggleFavorite (song) {
    let list

    function compare (item) {
      return item.id === song.id
    }

    if (isFavorite(song)) {
      // 新传来的歌曲已存在收藏歌曲数组
      // remove
      list = remove(FAVORITE_KEY, compare)
    } else {
      list = save(song, FAVORITE_KEY, compare, maxLen)
    }
    store.commit('setFavoriteList', list)
  }

  // 判断歌曲是否已被收藏
  function isFavorite (song) {
    const index = favoriteList.value.findIndex(item => {
      return item.id === song.id
    })
    return index > -1
  }

  return {
    getFavoriteIcon,
    toggleFavorite
  }
}
