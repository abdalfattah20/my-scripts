 document.querySelectorAll('.thumbnail').forEach(thumb => {
                            thumb.addEventListener('click', () => {
                                // إزالة class active من كل الthumbnails
                                document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                                // إضافة active للthumbnail المختار
                                thumb.classList.add('active');
                                // تغيير الصورة الرئيسية
                                const mainImage = document.getElementById('mainImage');
                                mainImage.src = thumb.src;
                            });
                        });
