import { Injectable } from '@nestjs/common';
import { foods as foundFoods, section as allSection } from '../data';

@Injectable()
export class FoodService {
  // Recover foods and section to render in the page
  recoverFoodAndSection() {
    // Find everything in DB and return it
    return {
      foods: foundFoods,
      section: allSection,
    };
  }

  deleteSection(removeSection) {
    // Recover the section and update foods DB and return boolean as well to confirm modifications
    console.log('deletesection', removeSection);
    return {
      foods: foundFoods,
      section: allSection,
    };
  }

  deleteExtra(removeExtra) {
    // Recover the extra and update foods DB and return boolean as well to confirm modifications
    console.log('deletesection', removeExtra);
    return {
      foods: foundFoods,
      section: allSection,
    };
  }

  deleteFood(foodId) {
    // Find DB of food findByIdAndDelete and update the state
    console.log('delete food id', foodId);
    return {
      foods: foundFoods,
      section: allSection,
    };
  }

  updateFood(
    foodId,
    foodName,
    foodPhoto,
    foodDescription,
    foodPrice,
    foodSection,
    foodExtra,
  ) {
    console.log(
      foodId,
      foodName,
      foodPhoto,
      foodDescription,
      foodSection,
      foodExtra,
      foodPrice,
    );
    // Recover the food by id add add back the data recovered from body
    // recover section and extra from DB
    // if foodSection not found in DB  => update sectionDB
    // if foodExtra not found in DB => update sectionDB
    return {
      _id: foodId,
      name: foodName,
      photo: foodPhoto,
      price: foodPrice,
      description: foodDescription,
      section: foodSection,
      extra: foodExtra,
    };
  }
}
