import dayjs from "dayjs";

export default class anxDate {
  static currentTime() {
    console.log("dayjs :>> ", dayjs);
    return dayjs().format("YYYY-MM-DD HH:mm:ss");
  }
}
