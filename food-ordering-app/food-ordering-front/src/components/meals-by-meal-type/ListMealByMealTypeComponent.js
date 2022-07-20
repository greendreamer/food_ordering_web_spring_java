import React, {useState, useEffect} from 'react'
import MealService from '../../services/MealService'
import { Modal, Button } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom';
import MealQuantityComponent from './MealQuantityComponent';
import { addItem } from '../../store-redux/cart/cartSlice';
import { useDispatch } from 'react-redux';

const ListMealByMealTypeComponent = () => {

    const {mealTypeId} = useParams();

    const [meals, setMeals] = useState([]);

    const [mealQuantity, setMealQuantity] = useState(1);

    const [show, setShow] = useState(false);

    const [id, setId] = useState(0);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');

    const meal = {id, name, price, image};

    const orderItem = {meal, quantity: mealQuantity};
    console.log(" order item ", orderItem);
     
    const mealQuantityObj = {mealQuantity, setMealQuantity};

    const dispatch = useDispatch()

    const handleShowMealQuantity = (meal) => {
        
       //mora ovako da se setuje, kada se vrsi izmena, nakon toga zapamti id od starog pa radi izmenu
        setId(meal.id);
        setName(meal.name);
        setPrice(meal.price);
        setImage(meal.image);
        setMealQuantity(1);
        setShow(true);
        
    };

    const handleClose = () => {
        setShow(false);
        setId(null);
        setName('');
        setPrice('');
        setImage('');
        setMealQuantity(1);
        

        }



    const getMealsByMealTypeId = () =>{
        console.log("mealtypeid" + mealTypeId);
        MealService.getMealsByMealTypeId(mealTypeId).then((response)=>{
            setMeals(response.data);
        }).catch(error => {
            console.log(error);
        })
    }

    useEffect(() => {
        getMealsByMealTypeId();
    }, [])
 

  return (
    <>
    <div className='container'>
            <h2 className='text-center'>Meals</h2>
            <button className="btn btn-success" >Go to cart</button>
            <table className='table table-bordered table-hover'>
                <thead className='thead-name'>
                    <tr>
                        
                        <th className='theadth'>Image</th>
                        <th className='theadth'>Name</th>
                        <th className='theadth'>Type</th>
                        <th className='theadth'>Price</th>
                        <th className='theadth'>Action</th>
                        

                    </tr>
                </thead>
                {/*mora src={"data:image/png;base64," + meal.image}, ne moze samo src={meal.image}  */}
                <tbody>
                    {meals.map(
                        meal => <tr key={meal.id}>
                            <td className='td-content-img'>
                            
                              <img className='mealPicture' src={"data:image/png;base64," + meal.image} alt=''/> 
                            
                                </td>
                                
                            <td className='td-content'>{meal.name}</td>
                            <td className='td-content'>{meal.mealType.typeName}</td>
                            <td className='td-content'>{meal.price}</td>
                            
                            <td className='td-content'>
                                <button className='btn btn-info' onClick={() =>handleShowMealQuantity(meal)}>Add to cart</button>
                                
                            </td>

                        </tr>
                    )}
                </tbody>

            </table>

        </div>

        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Insert quantity</Modal.Title>
        </Modal.Header>

        <Modal.Body>
            <MealQuantityComponent meal = {meal} mealQuantity = {mealQuantityObj} />
        </Modal.Body>

        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
            <Button variant="primary" onClick={() => dispatch(addItem(orderItem))}>Confirm</Button> 
            {/* onClick={handleSubmit} */}
        </Modal.Footer>
        </Modal>
        </>

  )
}

export default ListMealByMealTypeComponent