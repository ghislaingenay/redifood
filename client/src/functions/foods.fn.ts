export const changeActiveButton = (e, sectionList: any, foods) => {
  for (let i = 0; i < sectionList.length; i++) {
    if (sectionList[i].name === e) {
      let foodSection = foods?.filter((food) => food.section === e);
      // Creation of a new state allowing to display the data properly
      let sorted = [];
      // From the section[i] => loop inside the extra
      for (let j = 0; j < sectionList[i].extra.length; j++) {
        let newArr = foodSection.filter((food) => food.extra === sectionList[i].extra[j]);
        sorted.push({ extra: sectionList[i].extra[j], foods: newArr });
      }
      return sorted;
    }
  }
};
