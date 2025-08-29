document.querySelectorAll('.thumbnail').forEach(thumb => {
                            thumb.addEventListener('click', () => {
                                const mainImage = document.getElementById('mainImage');
                                const tempSrc = mainImage.src;
                                mainImage.src = thumb.src;
                                thumb.src = tempSrc; // تبديل مع الرئيسية أو فقط نسخ (يمكن تعديل حسب الحاجة)
                            });
                        });
