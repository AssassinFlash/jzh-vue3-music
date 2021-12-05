// 收藏功能的实现，利用了vuex和本地存储之间的配合
import { useStore } from 'vuex'
import { computed } from 'vue'
import { FAVORITE_KEY } from '@/assets/js/constant'
import { save, remove } from '@/assets/js/array-store'

export default function useFavorite () {
  // data
  const maxLen = 100

  // vuex
  const store = useStore()
  const favoriteList = computed(() => store.state.favoriteList) // 歌曲收藏数组

  // methods
  // 收藏图标样式更改
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
      list = remove(FAVORITE_KEY, compare)
    } else {
      list = save(song, FAVORITE_KEY, compare, maxLen)
    }
    // 最后修改全局歌曲收藏数组
    store.commit('setFavoriteList', list)
  }

  // 判断歌曲是否在收藏数组中
  function isFavorite (song) {
    function compare (item) {
      return item.id === song.id
    }

    const index = favoriteList.value.findIndex(compare)
    return index > -1
  }

  return {
    getFavoriteIcon,
    toggleFavorite
  }
}
