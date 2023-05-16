<template>
  <div class="datesel">
    <div className="date-items">
      <div className="date-item-caption">年</div>
      <div className="date-item-caption">月</div>
      <div className="date-item-caption">周</div>
      <div className="date-item-caption">一</div>
      <div className="date-item-caption">二</div>
      <div className="date-item-caption">三</div>
      <div className="date-item-caption">四</div>
      <div className="date-item-caption">五</div>
      <div className="date-item-caption">六</div>
      <div className="date-item-caption">日</div>
    </div>
    <div class="datesel-wrapper">
      <div class="year-wrapper" v-for="year in dates">
        <div className="year">{{ year.year }}</div>
        <div class="months">
          <div class="month-wrappe" v-for="month in year.month">
            <div className="month">{{ month.month }}</div>
            <div class="weeks">
              <div class="week-wrapper" v-for="week in month.weeks">
                <div className="week">{{ week.week }}</div>
                <div class="days">
                  <div class="day-wrapper" v-for="day in week.days">
                    <div
                      className="day"
                      style=" backgroundColor:selDay == day ? '#4354ff' : '',color:selDay == day? '#fff': day.isMonth? '': '#999'"
                      @click="onSelect"
                    >
                      {{ day.day }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  data() {
    return {
      dates: [],
      selDay: null,
      dayCount: 0,
      startWeek: 1,
      startDay: null,
    }
  },
  created() {
    this.init()
  },
  methods: {
    getYear(year, startMonth, endMonth) {
      // 定义一个syear对象，里面有year和months数组
      let sYear = {
        year: year,
        months: [],
      }
      // 哪年的开始月的一号
      // let startDate = moment(year + "-" + startMonth + "-" + "01");
      // 12-10 存入10 11 12月
      let yearMonths = endMonth - startMonth
      // console.log("yearMonths---->" + yearMonths);
      // yearMonths是差月
      for (let i = 0; i <= yearMonths; i++) {
        let month = {
          // 存入分别有几月
          month: startMonth + i,
          weeks: [],
        }
        // console.log('month.month----->' + month.month)
        for (let j = 0; j < 4; j++) {
          let week = {
            // 一共有四周
            week: this.startWeek++,
            days: [],
          }
          // console.log('week.week----->' + week.week)
          // console.log(
          //   "last_monday222",
          //   year +
          //     "-" +
          //     (month.month >= 10 ? month.month : "0" + month.month) +
          //     "-01"
          // );
          for (let k = 0; k < 7; k++) {
            week.days.push({
              // startDay-周一日期
              day: this.startDay.format('DD'),
              isMonth: this.startDay.format('YYYY-MM') === year + '-' + (month.month >= 10 ? month.month : '0' + month.month),
            })
            this.startDay.add(1, 'days')
          }
          month.weeks.push(week)
        }
        sYear.months.push(month)
        // console.log('sYear----------------' + sYear)
      }
      return sYear
    },
    selectDay(day, week, month, year, d) {
      if (this.onSelectDay) {
        this.onSelectDay(day, week, month, year)
      }
      this.selDay = d
    },
    init() {
      this.startYear = parseInt(this.startYear)
      this.startMonth = parseInt(this.startMonth)
      this.endYear = parseInt(this.endYear)
      this.endMonth = parseInt(this.endMonth)
      let dates = []
      const day01 = moment(this.startYear + '-' + (this.startMonth >= 10 ? this.startMonth : '0' + this.startMonth) + '-23', 'YYYY-MM-DD')
      // console.log('day01->' + day01)
      var weekOfday = day01.format('E') //计算指定日期是这周第几天
      // console.log('weekOfday=>' + weekOfday)
      var startDay = day01.subtract(weekOfday - 1, 'days') //周一日期
      this.startDay = startDay
      // console.log('this.startDay->' + this.startDay)
      if (this.endYear - this.startYear > 1) {
        // 2000 2003 i < 2 i++
        // 判断后dates中有
        // 2001 1 12
        // 2002 1 12
        // 最后dates中共有
        // 2000 开始月 12
        // 2001 1 12
        // 2002 1 12
        // 2003 1 结束月
        dates.push(this.getYear(this.startYear, this.startMonth, 12))
        for (let i = 0; i < this.endYear - this.startYear - 1; i++) {
          dates.push(this.getYear(this.startYear + i + 1, 1, 12))
        }
        dates.push(this.getYear(this.endYear, 1, this.endMonth))
      } else if (this.endYear - this.startYear == 1) {
        dates.push(this.getYear(this.startYear, this.startMonth, 12))
        dates.push(this.getYear(this.endYear, 1, this.endMonth))
      } else if (this.endYear - this.startYear == 0) {
        dates.push(this.getYear(this.startYear, this.startMonth, this.endMonth))
      }
      this.dates = dates
    },
    onSelect() {
      this.selectDay(day.day, week.week, month.month, year.year, day)
    },
  },
  props: {
    startYear: {
      type: [Number, String],
      require: true,
    },
    startMonth: {
      type: [Number, String],
      require: true,
    },
    endYear: {
      type: [Number, String],
      require: true,
    },
    endMonth: {
      type: [Number, String],
      require: true,
    },
  },
}
</script>

<style>
.datesel {
  padding: 20px;
  display: flex;
  border-right: 1px solid #eee;
  color: #000;
  box-sizing: border-box;
  overflow: auto;
  width: 100%;
}
.date-items {
  border-top: 1px solid #eee;
}
.date-item-caption {
  text-align: center;
  height: 30px;
  width: 30px;
  color: #000;
  font-weight: bold;
  line-height: 30px;
  border-left: 1px solid #eee;
  border-bottom: 1px solid #eee;
}
.datesel-wrapper {
  display: flex;
  flex-wrap: nowrap;
  border-right: 1px solid #eee;
}

.year-wrapper {
  display: flex;
  flex-direction: column;
  border-top: 1px solid #eee;
}
.year {
  text-align: center;
  line-height: 30px;
  border-left: 1px solid #eee;
  border-bottom: 1px solid #eee;
  text-align: center;
  font-weight: bold;
}
.month {
  text-align: center;
  line-height: 30px;
  border-left: 1px solid #eee;
  border-bottom: 1px solid #eee;
  text-align: center;
  font-weight: bold;
}
.months {
  display: flex;
}
.weeks {
  display: flex;
  font-weight: bold;
}
.week {
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  border-left: 1px solid #eee;
  border-bottom: 1px solid #eee;
}
.days {
  display: flex;
  flex-direction: column;
  font-weight: normal;
  color: #333;
}
.day {
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  border-left: 1px solid #eee;
  border-bottom: 1px solid #eee;
}
.day:hover {
  background-color: #eee;
  cursor: pointer;
}
</style>
