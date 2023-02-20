<template>
  <section class="container">
    <div class="forms">
      <!-- Много форм - чтобы структурировать предназначение каждого инпута -->
      <form>
        <span>Search by: </span>
        <label
          ><input
            v-model="checkedID"
            class="input input-checkbox"
            type="checkbox"
          />ID</label
        >
        <label
          ><input
            v-model="checkedBrand"
            class="input input-checkbox"
            type="checkbox"
          />Brand</label
        >
        <label
          ><input
            v-model="checkedAge"
            class="input input-checkbox"
            type="checkbox"
          />Age</label
        >
      </form>

      <form>
        <input
          placeholder="Search"
          class="input input-filter"
          type="text"
          v-model="searchedText"
        />
      </form>
      <MultiRangeSlider
        :min="1970"
        :max="2023"
        :step="1"
        :ruler="true"
        :label="true"
        :minValue="barMinValue"
        :maxValue="barMaxValue"
        @input="updateValues"
      />
    </div>

    <table
      class="table table-striped table-hover table-bordered border-primary table-sm"
      dara-search
    >
      <thead>
        <tr>
          <th scope="col">
            ID
            <button class="btn-sort" @click="sendRequest('id')">
              <img class="sort-icon" src="./../assets/sort.png" alt="" />
            </button>
          </th>
          <th scope="col">
            Brand
            <button class="btn-sort" @click="sendRequest('brand')">
              <img class="sort-icon" src="./../assets/sort.png" alt="" />
            </button>
          </th>
          <th scope="col">
            Age
            <button class="btn-sort" @click="sendRequest('age')">
              <img class="sort-icon" src="./../assets/sort.png" alt="" />
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in filteredData" :key="item">
          <th scope="row">{{ item.id }}</th>
          <td>{{ item.brand }}</td>
          <td>{{ item.age }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup>


import { ref, computed } from "vue";

import useFetchAsc from "../composables/useFetchAsc";
import useFetchDesc from "../composables/useFetchDesc";

import MultiRangeSlider from "multi-range-slider-vue";

import data from "../data.json";

// Set initial data

let parsedData = ref(data);
let searchedText = ref("");
let isAsc = ref(true);

let checkedID = ref(false);
let checkedAge = ref(false);
let checkedBrand = ref(false);

// API multi-range-slider

let barMinValue = ref(1960);
let barMaxValue = ref(2023);

let updateValues = (e) => {
  barMinValue.value = e.minValue;
  barMaxValue.value = e.maxValue;
};

// Normalized search text

let normalizedSearchedText = computed(() => {
  return searchedText.value.toLowerCase().trim();
});

// BIG computed which filters data

let filteredData = computed(() => {
  return parsedData.value.filter((item) => {
    for (let info in item) {
      // First comparsion with data from range-slider

      if (
        item["age"] <= barMaxValue.value &&
        item["age"] >= barMinValue.value
      ) {
        // Normalize items

        if (typeof item[info] == "number") {
          item[info] = item[info] + "";
        }
        let normalizedItem = item[info].toLowerCase().trim();

        // Second comparsion with checkboxes

        if (checkedBrand.value) {
          // Third comparsion, need to exclude other item keys

          if (info == "brand") {
            // Final comparsion search text with normalized item

            if (normalizedItem.includes(normalizedSearchedText.value)) {
              return normalizedItem;
            }
          }
        }
        if (checkedID.value) {
          if (info == "id") {
            if (normalizedItem.includes(normalizedSearchedText.value)) {
              return normalizedItem;
            }
          }
        }

        if (checkedAge.value) {
          if (info == "age") {
            if (normalizedItem.includes(normalizedSearchedText.value)) {
              return normalizedItem;
            }
          }
        }

        // Initial comparsion so that data is rendered on start

        if (!checkedAge.value && !checkedBrand.value && !checkedID.value) {
          if (normalizedItem.includes(normalizedSearchedText.value)) {
            return normalizedItem;
          }
        }
      }
    }
  });
});

// Use pseudocomposables and pass key as a parameter

let sendRequest = async (key) => {
  isAsc.value ? useFetchAsc(key) : useFetchDesc(key);
  isAsc.value = !isAsc.value;
};
</script>

<style scoped lang="scss">
.btn-sort {
  background-color: transparent;
  border: none;
  outline: none;
}
.multi-range-slider {
  width: 100%;
  margin: 0 auto 20px auto;
  box-shadow: none;
  background-color: rgb(175, 240, 234);
}

.sort-icon {
  width: 25px;
  height: 25px;
}

.container {
  max-width: 900px;
  margin: 200px auto;
}
.input-filter {
  padding: 5px;
  margin-bottom: 20px;
}
.input-checkbox {
  margin: 10px;
  width: 20px;
  height: 20px;
}
.forms {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}
</style>
