/*
 * Copyright (c) 2023 dzikoysk
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { defineConfig } from "windicss/helpers"
import colors from "windicss/colors"

export default defineConfig({
  darkMode: "class",
  plugins: [
    require('windicss/plugin/forms')
  ],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
    extend: {
      colors: {
        gray: {
          125: "#efefef",
          150: "#ececec",
          ...colors.neutral,
        },
      },
      fontSize: {
        xxs: ["0.45rem", { lineHeight: "0.5rem" }],
        xm: ["0.625rem", { lineHeight: "0.75rem" }],
        ssm: ["0.8rem", { lineHeight: "1.15rem" }],
      },
      fontFamily: {
        mono: ["Consolas", "Monaco", "monospace"],
      }
    },
  },
  shortcuts: {
    "default-button":
      "bg-white text-gray-800 border border-gray-300 shadow-sm cursor-pointer hover:(transition-colors duration-200 text-[#4f46e5] bg-gray-100) dark:bg-[#1d232d] dark:text-white dark:border-white dark:border-opacity-12 dark:hover:bg-[#252d39]",
  },
})
