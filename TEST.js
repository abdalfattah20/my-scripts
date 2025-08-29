const images = Array.from(document.querySelectorAll('.thumbnail')).map(thumb => thumb.src);
    const mainImage = document.getElementById('mainImage');

    // إضافة حدث click لكل thumbnail
    document.querySelectorAll('.thumbnail').forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            // تحديث الصورة الرئيسية
            mainImage.src = images[index];
            // إزالة class active من كل الthumbnails
            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            // إضافة active للthumbnail المختار
            thumb.classList.add('active');
        });
    });
