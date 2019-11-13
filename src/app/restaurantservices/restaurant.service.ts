import { Injectable } from '@angular/core'
import * as firebase from 'firebase'
import { Restaurant } from '../Restaurant'
import { FoodItem } from '../FoodItem'

const FOOD_ITEM_NAME_INDEX = 0
const FOOD_MACRO_INDEX = 1

const Restaurant_NAME_INDEX = 0
const LOCATION_INDEX = 2
const CHOICES_INDEX = 3
const IMAGE_INDEX = 4

export const snapshotToRestaurantArray = snapshot => {
    const returnArr = []
    let id = 0
    snapshot.forEach(childSnapshot => {
        const item = childSnapshot.val()
        // package everything up into an easily usable Restaurant object.
        const title = item[Restaurant_NAME_INDEX]
        const location = item[LOCATION_INDEX]
        const choices = Restaurant.parseChoices(item[CHOICES_INDEX])
        const restaurantImage = item[IMAGE_INDEX]

        const newRestaurant = new Restaurant(
            title,
            location,
            choices,
            id,
            restaurantImage
        )
        returnArr.push(newRestaurant)
        id++
    })

    return returnArr
}

// export const snapshotToFoodArray = snapshot => {
//     const returnArr = []
//     snapshot.forEach(childSnapshot => {
//         const item = childSnapshot.val()
//         const title = item[FOOD_ITEM_NAME_INDEX]
//         const macros = Recipe.parseMacros(item[FOOD_MACRO_INDEX])

//         const newFoodItem = new FoodItem(macros, title)

//         returnArr.push(newFoodItem)
//     })

//     return returnArr
// }

@Injectable({
    providedIn: 'root',
})
export class RestaurantService {
    private restaurants = []
    private foodItems = []
    private restaurantDB = firebase.database().ref('restaurantSheet/')
    private foodDB = firebase.database().ref('foodSheet/')
    constructor() {
        // grab recipe data from Firebase, and pack it into an array.
        this.restaurantDB.on('value', resp => {
            this.restaurants = snapshotToRestaurantArray(resp)
        })

        // do the same with food items.
        // this.foodDB.on('value', resp => {
        //     this.foodItems = snapshotToFoodArray(resp)
        // })
    }
    get getRestaurant(): Array<Restaurant> {
        return this.restaurants
    }

    // get foodList(): Array<FoodItem> {
    //     return this.foodItems
    // }
}