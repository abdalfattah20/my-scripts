const imageInput = document.getElementById("imageInput");
    const orderInput = document.getElementById("orderNumber");
    const out = document.getElementById("output");

    const VISION_API = "https://script.google.com/macros/s/AKfycbwWLWyFv-66A93QUff0rz0wo60QbkjBCa5bWmrMZ928q267V93qmiR2FDZm0S1cGSj5/exec";
    const ORDER_API = "https://script.google.com/macros/s/AKfycbx8sGhd7QS19zUEcYnfmuxxXg7Mec3cZzX7w2bi0kt54RxCgO0rvihddIi2Bt4QT5MQLw/exec";
    const CONFIRM_API = "https://script.google.com/macros/s/AKfycbxlZU7zyqWK4TCZyAL0t-b2JTsn5yVEqQYMqb7SOw1uSAcvZAryztA-mGzFuoA1jHOu/exec";
    const LOG_SHEET_API = "https://script.google.com/macros/s/AKfycbzaPQOEf-_it3c2fgJGjyg3a6aBiUHNN0_eJ5xTqrTO-rrsQXO0ZSXJfu-QNJdpLJuB/exec";


    imageInput.addEventListener("change", async () => {
      const file = imageInput.files[0];
      if (!file) return;

      const orderNumber = orderInput.value.trim();
      if (!orderNumber) {
        out.className = "error";
        out.textContent = "خطأ: من فضلك أدخل رقم الواتساب الخاص بك أولا قبل رفع الصورة.";
        imageInput.value = ""; 
        return;
      }

      out.className = "loading";
      // --- بداية التعديل: استخدام innerHTML لعرض النص المختلط بشكل صحيح ---
      out.innerHTML = `جاري فحص الصورة...`;

      try {
        const dataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const visionResp = await fetch(VISION_API, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: dataUrl
        });
        
        if (!visionResp.ok) {
           throw new Error(`خطأ في الاتصال بخادم استخراج النص: ${visionResp.statusText}`);
        }

        const visionData = await visionResp.json();

        if (!visionData.success || !visionData.text) {
          throw new Error('فشل استخراج النص: ' + (visionData.error || 'لم يتم إرجاع أي نص.'));
        }

        const text = visionData.text;
        const allNumbers = text.match(/\d+/g) || [];
        const candidateBlocks = allNumbers.filter(num => num.length >= 6 && num.length <= 7);

        if (candidateBlocks.length < 9) {
          throw new Error("خطأ: لم يتم العثور على 9 مجموعات أرقام صالحة في الصورة. جرب صورة أوضح.");
        }
        
        const finalIdBlocks = candidateBlocks.slice(-9);
        const combinedID = finalIdBlocks.join('');

        if (combinedID.length > 40) {
          out.innerHTML = `تم فحص الصوره , جاري التحقق من حالة الطلب...`;

          const orderResp = await fetch(`${ORDER_API}?orderNumber=${encodeURIComponent(orderNumber)}&action=check`);
          const orderData = await orderResp.json();

          if (!orderData.success) {
            out.className = "error";
            out.textContent = orderData.message;
            return;
          }

          out.innerHTML = `الطلب صحيح , جاري حل المشكلة...`;
          const params = new URLSearchParams({ iid: combinedID });
          const url = `${CONFIRM_API}?${params.toString()}`;
          const resp = await fetch(url);
          if (!resp.ok) throw new Error("فشل الاتصال بخادم التفعيل: " + resp.status);
          const data = await resp.json();

  if (data.cid) {
    // تجهيز البيانات لإرسالها للشيت الجديد
    const logFormData = new FormData();
    logFormData.append('whatsappNumber', orderNumber);
    logFormData.append('confirmationId', data.cid);
    logFormData.append('installationId', combinedID);
    
    // تنفيذ الطلبين في نفس الوقت (خصم الرصيد وتسجيل البيانات)
    const decrementPromise = fetch(`${ORDER_API}?orderNumber=${encodeURIComponent(orderNumber)}&action=decrement`).then(res => res.json());
    const logPromise = fetch(LOG_SHEET_API, { method: 'POST', body: logFormData });

    // انتظر حتى يكتمل الطلبان
    const [decData] = await Promise.all([decrementPromise, logPromise]);

    // الجزء المتبقي كما هو لعرض النتيجة للمستخدم
    let cidString = String(data.cid);
    let formattedCID = cidString;

    if (!cidString.includes('-') && cidString.length > 6) {
        formattedCID = cidString.match(/.{1,6}/g).join('-');
    }

    out.className = "success";
    out.textContent = "تم حل المشكلة بنجاح, ارجع الى صفحة التفعيل فى الويندوز و جرب السيريال مرة أخرى كأنك تقوم بتفعيله لأول مرة. سيتم التفعيل بنجاح, و لو ظهرت اى رسائل خطا او لم يتم التفعيل قم بعمل ريستارت للجهاز و ستجد ان التفعيل تم تلقائيا";
}
 else {
            out.className = "error";
            out.innerHTML = `خطأ: لم يتم العثور على <span class="ltr-text">Confirmation IDالـ</span> , قد يكون <span class="ltr-text">Installation IDالـ</span> المستخرج خاطئاً.<br><span class="ltr-text">Installation IDالـ</span> الذي تم استخراجه:<br><span class="ltr-block">${combinedID}</span>`;
          }
        } else {
           out.className = "error";
           out.textContent = `خطأ: لم يتم العثور على <span class="ltr-text">Installation IDالـ</span> صالح.`;
        }
      } catch (err) {
        out.className = "error";
        out.textContent = err.message;
      }
    });

    // Lightbox
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const closeBtn = document.getElementById("closeBtn");
    document.querySelectorAll(".examples img").forEach(img => {
      img.addEventListener("click", () => {
        lightbox.style.display = "flex";
        lightboxImg.src = img.src;
      });
    });
    closeBtn.addEventListener("click", () => { lightbox.style.display = "none"; });
    lightbox.addEventListener("click", e => { if (e.target === lightbox) lightbox.style.display = "none"; });