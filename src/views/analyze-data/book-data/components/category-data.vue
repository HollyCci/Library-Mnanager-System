<template>
  <div ref="pieRef"></div>
</template>
<script setup lang="ts">
/* eslint-disable */
import { ref, onMounted } from "vue";
import { type ECOption, useEcharts } from "@/composables";
import * as DataApi from "@/service/api/data";

interface ScaleDataItem {
  value: number;
  name: string;
}

let scaleData: ScaleDataItem[] = [];
const rich = {
  white: {
    color: "#ddd",
    align: "center",
    padding: [3, 0],
  },
};

const placeHolderStyle = {
  normal: {
    label: {
      show: false,
    },
    labelLine: {
      show: false,
    },
    color: "rgba(0, 0, 0, 0)",
    borderColor: "rgba(0, 0, 0, 0)",
    borderWidth: 0,
    shadowBlur: 0,
    shadowColor: "rgba(0, 0, 0, 0)",
  },
};

interface CategoryItem {
  value: number;
  name: string;
  itemStyle: {
    normal: {
      borderWidth: number;
      shadowBlur: number;
      borderColor: string;
      shadowColor: string;
    };
  };
}

const categoryData: CategoryItem[] = [];
const color = [
  "#00ffff",
  "#00cfff",
  "#006ced",
  "#ffe000",
  "#ffa800",
  "#ff5b00",
  "#ff3000",
];

for (let i = 0; i < scaleData.length; i++) {
  categoryData.push(
    {
      value: scaleData[i].value,
      name: scaleData[i].name,
      itemStyle: {
        normal: {
          borderWidth: 5,
          shadowBlur: 20,
          borderColor: color[i],
          shadowColor: color[i],
        },
      },
    },
    {
      value: 2,
      name: "",
      itemStyle: {
        normal: {
          borderWidth: placeHolderStyle.normal.borderWidth,
          shadowBlur: placeHolderStyle.normal.shadowBlur,
          borderColor: placeHolderStyle.normal.borderColor,
          shadowColor: placeHolderStyle.normal.shadowColor,
        },
      },
    }
  );
}

const categorySeriesObj = [
  {
    name: "",
    type: "pie",
    clockWise: false,
    radius: [15, 80],
    hoverAnimation: false,
    itemStyle: {
      normal: {
        label: {
          show: true,
          position: "outside",
          color: "#ddd",
          formatter(params: any) {
            let percent = 0;
            let total = 0;
            for (let i = 0; i < scaleData.length; i++) {
              total += scaleData[i].value;
            }
            percent = Number(((params.value / total) * 100).toFixed(0));
            if (params.name !== "") {
              return `${params.name}\n{white|` + `占比${percent}%}`;
            }
            return "";
          },
          rich,
        },
        labelLine: {
          length: 30,
          length2: 100,
          show: true,
          color: "#00ffff",
        },
      },
    },
    data: categoryData,
  },
];

const pieOptions = ref<ECOption>({
  // @ts-ignore
  title: {
    text: "图书分类占比",
    top: "44%",
    textAlign: "center",
    left: "44%",
    textStyle: {
      color: "#fff",
      fontSize: 22,
      fontWeight: "400",
    },
  },
  backgroundColor: "#04243E",
  tooltip: {
    show: false,
  },
  legend: {
    show: false,
  },
  toolbox: {
    show: false,
  },
  // @ts-ignore
  series: categorySeriesObj,
});
// @ts-ignore
const { domRef: pieRef } = useEcharts(pieOptions.value);

const initCategoryData = async () => {
  for (let i = 0; i < scaleData.length; i++) {
    categoryData.push(
      {
        value: scaleData[i].value,
        name: scaleData[i].name,
        itemStyle: {
          normal: {
            borderWidth: 5,
            shadowBlur: 20,
            borderColor: color[i],
            shadowColor: color[i],
          },
        },
      },
      {
        value: 2,
        name: "",
        itemStyle: placeHolderStyle,
      }
    );
  }

  // @ts-ignore
  pieOptions.value.series = [
    {
      name: "",
      type: "pie",
      clockWise: false,
      radius: [95, 100],
      center: ["45%", "50%"],
      hoverAnimation: false,
      itemStyle: {
        normal: {
          label: {
            show: true,
            position: "outside",
            color: "#ddd",
            formatter(params: any) {
              let percent = 0;
              let total = 0;
              for (let i = 0; i < scaleData.length; i++) {
                total += scaleData[i].value;
              }
              percent = Number(((params.value / total) * 100).toFixed(0));
              if (params.name !== "") {
                return `${params.name}\n{white|` + `占比${percent}%}`;
              }
              return "";
            },
            rich,
          },
          labelLine: {
            length: 30,
            length2: 100,
            show: true,
            color: "#00ffff",
          },
        },
      },
      data: categoryData,
    },
  ];
};

onMounted(async () => {
  const res = await DataApi.getCommonBookData();
  // @ts-ignore
  scaleData = res.data.categoryList;

  initCategoryData();
});
</script>
