import React, {useState, useEffect} from 'react'
import MealService from '../../services/MealService'
import { Modal, Button } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom';
import MealQuantityComponent from './MealQuantityComponent';
import { addItem } from '../../store-redux/cart/cartSlice';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import './ListMealByMealTypeComponent.css';

const ListMealByMealTypeComponent = () => {

    const {mealTypeId} = useParams();

    const [meals, setMeals] = useState([]);

    const [mealQuantity, setMealQuantity] = useState(1);
    
    const [show, setShow] = useState(false);

    const [id, setId] = useState(0);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const [mealType, setMealType] = useState(undefined);

    const meal = {id, name, mealType, price, image};
    // const meal = {id, name, price, image};

    const orderItem = {meal, quantity: mealQuantity};
     
    const mealQuantityObj = {mealQuantity, setMealQuantity};

    const dispatch = useDispatch();

    const navigate = useNavigate();

    useEffect(() => {
        getMealsByMealTypeId();
    }, [])

    const handleShowMealQuantity = (meal) => {   
        //mora ovako da se setuje, kada se vrsi izmena, nakon toga zapamti id od starog pa radi izmenu
        setId(meal.id);
        setName(meal.name);
        setPrice(meal.price);
        // treba setMealType(meal.mealType) umesto setMealType(meal.mealType.typeName); ukoliko hocu da citam i mealType
        // u tabeli na front-u, jer posle kada se salje na server-u, ne moze da parsira typeName sto dobije, pa bude bad request
        // ili da menjam logiku na back-u za model, mada onda bi se sve zapetljalo
        // bolje resenje bi bilo da ne saljem objekte vec varijable, jer se posle ulancaju objekti
        // i dosta nepotrebnih podataka se salje
        setMealType(meal.mealType)
        // setMealType(meal.mealType.typeName);
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
        setMealType(undefined);
        setMealQuantity(1);
        }

    const getMealsByMealTypeId = () =>{
        MealService.getMealsByMealTypeId(mealTypeId).then((response)=>{
            setMeals(response.data);
            console.log("meals" + JSON.stringify(response.data));
        }).catch(error => {
            console.log(error);
        })
    }

    const handleAddItemToCart = () =>{    
        console.log("orderitem" + JSON.stringify(orderItem));
        if(orderItem.quantity>0){
            dispatch(addItem(orderItem));
            alertSuccess('Successfully added item to cart!');
            handleClose();
        }
        else{
            alertInvalidInput('Invalid input, quantity must be positve number!');
        }
    }

    const alertSuccess = (message) =>{
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: message,
          showConfirmButton: false,
          timer: 1500
        });
      }

      const alertInvalidInput = (message) =>{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: message  
        });
      }

      const navigateToCart = () =>{
        navigate("/cart");
      }

  return (
    <>
    <div className='container-meal-by-meal-type'>
            
            <button id="btn-goTo-cart" className="btn btn-success mb-2" onClick={navigateToCart} >Go to cart</button>
            {meals.length !== 0 && <h2 className='text-center'>Category: {meals[0].mealType.typeName}</h2>}
            <table className='table table-hover tableElement'>
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
                              <img className='mealPic' src={"data:image/png;base64," + meal.image} alt=''/> 
                            </td>  
                            <td className='td-content'>{meal.name}</td>
                            <td className='td-content'>{meal.mealType.typeName}</td>
                            <td className='td-content'>{meal.price}</td>
                            <td className='td-content'>
                                <button className='btn btn-success' onClick={() =>handleShowMealQuantity(meal)}>Add to cart</button>    
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
            <Button variant="primary" onClick={() => handleAddItemToCart()}>Confirm</Button> 
        </Modal.Footer>
        </Modal>
        </>

  )
}

export default ListMealByMealTypeComponent