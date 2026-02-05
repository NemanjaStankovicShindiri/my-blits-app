/*
 * Copyright 2024 Comcast Cable Communications Management, LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import Blits from '@lightningjs/blits'
import Card from './Card'
import Button from './Button'

export default Blits.Component('List', {
  components: { Card, Button },
  template: `
    <Element :x.transition="$x">
      <Component
        :for="(item, index) in $items"
        is="$item.type"
        :item="$item"
        :x="$index * $totalWidth"
        :ref="'list-item-'+$item.data.id"
        :key="$item.data.id"
      />
    </Element>
  `,
  props: [
    'autoScroll',
    'autoscrollOffset',
    'itemOffset',
    'itemHeight',
    'itemWidth',
    'items',
    'looping',
    'containerWidth',
  ],
  state() {
    return {
      focused: 0,
      x: 0,
      borderWidth: 0,
    }
  },
  computed: {
    totalWidth() {
      return (this.items[0].width || 300) + (this.itemOffset || 0)
    },
  },
  hooks: {
    focus() {
      this.$trigger('focused')
      this.$select(`list-item-${this.items[this.focused].data.id}`)?.$focus()
    },
  },
  watch: {
    hasFocus(isFocused) {
      if (isFocused) this.$trigger('focused')
    },
    focused(value) {
      const focusItem = this.$select(`list-item-${this.items[value].data.id}`)
      if (focusItem && focusItem.$focus) {
        focusItem.$focus()
        this.scrollToFocus()
      }
    },
  },
  methods: {
    changeFocus(direction) {
      const nextFocus = this.looping
        ? (this.focused + direction + this.items.length) % this.items.length
        : Math.max(0, Math.min(this.focused + direction, this.items.length - 1))
      this.focused = nextFocus
    },
    scrollToFocus() {
      if (this.autoScroll) {
        this.x =
          0 -
          (this.items.length - 1770 / (this.items[0].width + this.itemOffset) < 0
            ? 0
            : Math.min(
                this.focused,
                this.items.length - 1770 / (this.items[0].width + this.itemOffset)
              ) *
              (this.items[0].width + this.itemOffset))
        // const maxScrollIndex = Math.max(0, this.items.length - (this.autoscrollOffset || 0))
        // this.x = -(index <= maxScrollIndex ? index : maxScrollIndex) * this.totalWidth
      }
    },
  },
  input: {
    left() {
      this.changeFocus(-1)
    },
    right() {
      this.changeFocus(1)
    },
    enter() {
      console.log('Selected item:', this.items[this.focused])
    },
  },
})
