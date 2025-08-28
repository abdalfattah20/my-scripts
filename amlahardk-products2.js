

document.title = "Windows 11 Pro | AmlaHardk";


async function fetchSimilarProducts() {
    const currentProductId = document.getElementById('current-product-id').value;
    const currentProductName = document.querySelector('.product-title').textContent.trim().toLowerCase();
    const similarProductsContainer = document.getElementById('similarProducts');

    try {
       const response = await fetch('https://docs.google.com/spreadsheets/d/1ZFV3uQVsTF6Ra9wYJ3h7WnIjSLZtx-BlObj7m7gTdsE/gviz/tq?tqx=out:json&gid=0');
        const text = await response.text();
        const json = JSON.parse(text.substr(47).slice(0, -2));
        
        const rows = json.table.rows;
        let similarProductsHTML = '';

        const filteredProducts = rows.filter(row => {
            return row.c[4] && row.c[4].v == currentProductId;
        });

        if (filteredProducts.length === 0) {
            similarProductsContainer.innerHTML = '<p>لا توجد منتجات مشابهة متاحة حالياً</p>';
            return;
        }

        filteredProducts.slice(0, 9).forEach(row => {
            const imageUrl = row.c[0]?.v || '';
            const productName = row.c[1]?.v || '';
            const productPrice = row.c[2]?.v || '';
            const productUrl = row.c[3]?.v || '';

            // استبعاد المنتج الحالي بناءً على الاسم
            if (productName.trim().toLowerCase() === currentProductName) {
                return; // تخطي هذا المنتج
            }

            similarProductsHTML += `
                <div class="product">
                    <a href="${productUrl}">
                        <img alt="${productName}" src="${imageUrl}" />
                    </a>
                    <div class='product-content'>
                        <h4>${productName}</h4>
                        <p>${productPrice} ج.م</p>
                    </div>
                </div>
            `;
        });

        if (similarProductsHTML === '') {
            similarProductsContainer.innerHTML = '<p>لا توجد منتجات مشابهة متاحة حالياً</p>';
            return;
        }

        similarProductsContainer.innerHTML = similarProductsHTML;
        initScrollButtons();

    } catch (error) {
        console.error('Error fetching similar products:', error);
        similarProductsContainer.innerHTML = '<p>لا توجد منتجات مشابهة متاحة حالياً</p>';
    }
}

// وظائف أزرار التمرير
function initScrollButtons() {
    const productsGrid = document.getElementById('similarProducts');
    const scrollLeft = document.getElementById('scrollLeft');
    const scrollRight = document.getElementById('scrollRight');

    function checkScroll() {
        const scrollable = productsGrid.scrollWidth > productsGrid.clientWidth;

        if (!scrollable) {
            scrollLeft.style.display = 'none';
            scrollRight.style.display = 'none';
        } else {
            scrollLeft.style.display = 'flex';
            scrollRight.style.display = 'flex';
        }
    }

    checkScroll();
    window.addEventListener('resize', checkScroll);

    scrollLeft.addEventListener('click', function() {
        productsGrid.scrollBy({
            left: -productsGrid.clientWidth,
            behavior: 'smooth'
        });
    });

    scrollRight.addEventListener('click', function() {
        productsGrid.scrollBy({
            left: productsGrid.clientWidth,
            behavior: 'smooth'
        });
    });
}

document.addEventListener('DOMContentLoaded', fetchSimilarProducts);


  
  
  
  
  
  
  
  
  
  
  
  
  
document.addEventListener('DOMContentLoaded', function () {
    const productsGrid = document.getElementById('similarProducts');
    const scrollLeft = document.getElementById('scrollLeft');
    const scrollRight = document.getElementById('scrollRight');

   function checkScroll() {
    const scrollable = productsGrid.scrollWidth > productsGrid.clientWidth;

    if (!scrollable) {
        scrollLeft.style.display = 'none';
        scrollRight.style.display = 'none';
    } else {
        scrollLeft.style.display = 'flex';
        scrollRight.style.display = 'flex';
    }
}


    checkScroll();
    window.addEventListener('resize', checkScroll);

    scrollLeft.addEventListener('click', function () {
        productsGrid.scrollBy({
            left: -productsGrid.clientWidth,
            behavior: 'smooth'
        });
    });

    scrollRight.addEventListener('click', function () {
        productsGrid.scrollBy({
            left: productsGrid.clientWidth,
            behavior: 'smooth'
        });
    });
});


  
  
  
  
   
        function changeImage(element) {
            document.getElementById('mainImage').src = element.src;
        }

  
  

  
  

function showAddToCartAlert() {
    const alertBox = document.getElementById('addToCartAlert');
    const addToCartButton = document.querySelector('.add-to-cart');

    
    const rect = addToCartButton.getBoundingClientRect();
    
    
    alertBox.style.left = `${rect.left + window.scrollX}px`;
    alertBox.style.top = `${rect.top + window.scrollY - 40}px`; // 40px فوق الزر
    alertBox.style.display = 'block';
    alertBox.style.animation = 'fadeInOut 3s ease-in-out forwards';

    
    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 3000);
}

 
  
  
  
 
 function handleAddToCart() {
    const productName = document.querySelector('.product-title').textContent;
    const productPrice = parseFloat(document.querySelector('.current-price').textContent.replace(' جنيه', ''));
    const productQuantity = parseInt(document.querySelector('#quantity').value);
    const productImage = document.querySelector('.main-image').src;
    const productCategory = document.getElementById('product-category').value;

    addToCart(productName, productPrice, productQuantity, productImage, productCategory);
    showAddToCartAlert();
}

  
  
  
  
 
    function handleBuyNow() {
    const productName = document.querySelector('.product-title').textContent;
    const productPrice = parseFloat(document.querySelector('.current-price').textContent.replace(' جنيه', ''));
    const productQuantity = parseInt(document.querySelector('#quantity').value);
    const productImage = document.querySelector('.main-image').src;
    const productCategory = document.getElementById('product-category').value; // إضافة الفئة

    const singleItemCart = [{
        name: productName,
        price: productPrice,
        quantity: productQuantity,
        image: productImage,
        category: productCategory // إضافة حقل الفئة
    }];

    localStorage.setItem('cart', JSON.stringify(singleItemCart));
    window.location.href = 'https://www.amlahardk.com/p/checkout.html';
}






 

  let cart = [];


function updateCartUI() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const totalPriceContainer = document.querySelector('.total-price');
    const cartCountContainer = document.querySelector('.cart-count');

    
    cartItemsContainer.innerHTML = '';
    let totalPrice = 0;

    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-message">السلة فارغة</p>';
        cartCountContainer.textContent = '0';
        totalPriceContainer.textContent = '0';
        return;
    }

    
    cart.forEach((item, index) => {
        totalPrice += item.price * item.quantity;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-details">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image" style="width: 50px; height: 50px; margin-right: 10px;" />
                <p>${item.name} - ${item.price} ج.م × ${item.quantity}</p>
            </div>
            <button class="remove-item" onclick="removeFromCart(${index})">X</button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    
    cartCountContainer.textContent = cart.length;
    totalPriceContainer.textContent = totalPrice.toFixed(2);
}


function addToCart(name, price, quantity, image, category) {
    const existingProductIndex = cart.findIndex(item => 
        item.name === name && item.price === price && item.image === image
    );

    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += quantity;
    } else {
        const product = { name, price, quantity, image, category };
        cart.push(product);
    }

    updateCartUI();
    saveCartToLocalStorage();
}




function removeFromCart(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        cart.splice(index, 1);
    }
    updateCartUI();
    saveCartToLocalStorage();
}



function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

 
function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}


loadCartFromLocalStorage();





document.querySelector('.checkout-btn').addEventListener('click', function() {
    if (cart.length > 0) {
        
        const hasCategoryA = cart.some(item => item.category === 'a');
        const hasCategoryB = cart.some(item => item.category === 'b');

        if (hasCategoryA && hasCategoryB) {
            window.location.href = 'checkout3.html';
        } else if (hasCategoryA) {
            window.location.href = 'https://www.amlahardk.com/p/checkout.html';
        } else if (hasCategoryB) {
            window.location.href = 'checkout2.html';
        } else {
            
            window.location.href = 'checkout1.html';
        }
    } else {
        alert('السلة فارغة، أضف منتجات أولا');
    }
});

