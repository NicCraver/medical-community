import PatientInfoCard from "./src/PatientInfoCard";

PatientInfoCard.install = function (Vue) {
  Vue.component(PatientInfoCard.name, PatientInfoCard);
};

export default PatientInfoCard;
