<template>
  <div>
    <div>{{ expression }}</div>
    <form @submit.prevent="calculate">
      <div>
        <button type="button" @click.stop="expression += '+'">+</button>
        <button type="button" @click.stop="expression += '-'">-</button>
        <button type="button" @click.stop="expression += '*'">*</button>
        <button type="button" @click.stop="expression += '/'">/</button>
      </div>
      <div>
        <button type="button" @click.stop="expression += '.'">.</button>
        <button type="button" @click.stop="expression += '9'">9</button>
        <button type="button" @click.stop="expression += '8'">8</button>
        <button type="button" @click.stop="expression += '7'">7</button>
      </div>
      <div>
        <button type="button" @click.stop="expression += '6'">6</button>
        <button type="button" @click.stop="expression += '5'">5</button>
        <button type="button" @click.stop="expression += '4'">4</button>
        <button type="button" @click.stop="expression += '3'">3</button>
      </div>
      <div>
        <button type="button" @click.stop="expression += '2'">2</button>
        <button type="button" @click.stop="expression += '1'">1</button>
        <button type="button" @click.stop="expression += '0'">0</button>
        <button type="submit">=</button>
      </div>
      <div>
        <button type="button" @click.stop="expression = ''">Clear</button>
      </div>
    </form>
  </div>
</template>

<script>
import { evaluate } from 'mathjs'

export default {
  name: 'App',
  data() {
    return {
      expression: '',
    }
  },
  methods: {
    calculate() {
      this.expression = evaluate(this.expression)
    },
  },
}
</script>

<style scoped>
button {
  width: 20px;
}

#clear-button {
  width: 50px;
}
</style>
