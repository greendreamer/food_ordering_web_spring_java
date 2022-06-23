package com.example.foodorderback.serviceImpl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.foodorderback.dto.MealDTO;
import com.example.foodorderback.model.Meal;
import com.example.foodorderback.repository.MealRepository;
import com.example.foodorderback.service.MealService;


@Service
public class MealServiceImpl implements MealService {
	
	@Autowired
	MealRepository mealRepository;
	
	private String localpatch = getLocalPatch();
	
	// C:\Users\cileb\Desktop\foapp\food-ordering-app\food-order-back\image-meals

	private String getLocalPatch() {
		String patch = "C:";
		Character s = '\\';
		String[] tokens = { "Users", "cileb", "Desktop", "foapp", "food-ordering-app", "food-order-back", "image-meals" };
		for (int i = 0; i < tokens.length; i++) {
			patch += s + tokens[i];
		}
		patch += s;
		return patch;
	}
	
	@Override
	public String isValidInput(Meal meal) {
		if (meal.getPrice() < 1 
				|| meal.getMealType() == null || meal.getName() == null || meal.getName().trim().isEmpty()) {
			return "invalid";
		}
		return "valid";
	}

	@Override
	public Meal save(Meal meal) {
		return mealRepository.save(meal);
	}

	@Override
	public List<MealDTO> findAll() {
		List<Meal> allMealList = mealRepository.findAll();
		List<MealDTO> allMealDTOList = new ArrayList<MealDTO>();

		for (Meal meal : allMealList) {
			//MealDTO mealDTO = MealMapper.INSTANCE.entityToDTO(meal);
			MealDTO mealDTO = new MealDTO(meal);
			allMealDTOList.add(mealDTO);
		}
		return allMealDTOList;
	}

	@Override
	public Meal delete(Meal meal) {
		
		if (meal == null)
			throw new IllegalArgumentException("Attempt to delete non-existing meal.");
		mealRepository.delete(meal);
		return meal;
	}

	@Override
	public MealDTO findOne(Long id) {
		Meal meal = mealRepository.findById(id).get();
		//MealDTO mealDTO = MealMapper.INSTANCE.entityToDTO(meal);
		MealDTO mealDTO = new MealDTO(meal);
		return mealDTO;
	}

	
	
	

	@Override
	public String editMeal(Meal meal) {
		Meal m = mealRepository.findById(meal.getId()).get();
		if (isValidInput(meal).equals("invalid")) {
			return "invalid";
		}
		
		m.setPrice(meal.getPrice());
		m.setName(meal.getName());
		
		m.setMealType(meal.getMealType());
		
		mealRepository.save(m);
		return "success";
	}

	

}
