const menuBtn=document.querySelector('.menu-btn'),menu=document.querySelector('#menu');
menuBtn?.addEventListener('click',()=>{const open=menu.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(open));});
menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');menuBtn?.setAttribute('aria-expanded','false')}));
const form=document.querySelector('#form'),status=document.querySelector('#form-status');
const CONFIG={endpoint:''};
form?.addEventListener('submit',async e=>{e.preventDefault();if(!form.reportValidity())return;const btn=form.querySelector('button');btn.disabled=true;btn.textContent='Đang kiểm tra…';status.textContent='';
 if(!CONFIG.endpoint){await new Promise(r=>setTimeout(r,500));status.textContent='Hiện tại vui lòng gọi 0916 85 85 66 để nhận vị trí và thông tin lô đất.';btn.disabled=false;btn.textContent='Gửi yêu cầu';return;}
 try{const res=await fetch(CONFIG.endpoint,{method:'POST',body:new FormData(form)});if(!res.ok)throw new Error();status.textContent='Đã gửi thông tin. Cảm ơn chị/anh!';form.reset()}catch{status.textContent='Chưa gửi được. Vui lòng gọi trực tiếp để được hỗ trợ.'}finally{btn.disabled=false;btn.textContent='Gửi yêu cầu'};
});
