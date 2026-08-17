const menuBtn=document.querySelector('.menu-btn'),menu=document.querySelector('#menu');
menuBtn?.addEventListener('click',()=>{const open=menu.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(open));});
menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');menuBtn?.setAttribute('aria-expanded','false')}));

const form=document.querySelector('#form'),status=document.querySelector('#form-status');
const phoneInput=form?.querySelector('input[name="phone"]');
const phoneError=document.querySelector('#phone-error');
const CONFIG={endpoint:'https://script.google.com/macros/s/AKfycbx0TCWFM7TsEIHvU9N0JSWFgHmptdbs8obU3TTLartP1xf_PB9u-tXcg99T8FT_uJROTA/exec'};

function normalizeVietnamPhone(value){
  let digits=(value||'').replace(/\D/g,'');
  if(digits.startsWith('84')&&digits.length===11)digits='0'+digits.slice(2);
  return digits;
}
function isValidVietnamMobile(value){
  return /^0(?:3|5|7|8|9)\d{8}$/.test(normalizeVietnamPhone(value));
}
function validatePhone(){
  if(!phoneInput)return true;
  const raw=phoneInput.value.trim();
  if(!raw){
    phoneInput.setCustomValidity('Vui lòng nhập số điện thoại.');
    if(phoneError)phoneError.textContent='Vui lòng nhập số điện thoại.';
    return false;
  }
  if(!isValidVietnamMobile(raw)){
    phoneInput.setCustomValidity('Số điện thoại chưa đúng. Vui lòng nhập số di động Việt Nam gồm 10 số, ví dụ 0916858566.');
    if(phoneError)phoneError.textContent='Số điện thoại chưa đúng. Vui lòng kiểm tra lại (ví dụ: 0916 85 85 66).';
    return false;
  }
  phoneInput.setCustomValidity('');
  if(phoneError)phoneError.textContent='';
  return true;
}
phoneInput?.addEventListener('input',()=>{phoneInput.setCustomValidity('');if(phoneError)phoneError.textContent='';});
phoneInput?.addEventListener('blur',validatePhone);

form?.addEventListener('submit',async e=>{
  e.preventDefault();
  const phoneOk=validatePhone();
  if(!phoneOk||!form.reportValidity())return;
  phoneInput.value=normalizeVietnamPhone(phoneInput.value);
  const btn=form.querySelector('button');btn.disabled=true;btn.textContent='Đang kiểm tra…';status.textContent='';
  if(!CONFIG.endpoint){await new Promise(r=>setTimeout(r,500));status.textContent='Hiện tại vui lòng gọi 0916 85 85 66 để nhận vị trí và thông tin lô đất.';btn.disabled=false;btn.textContent='Gửi yêu cầu';return;}
  try{
    const payload=new FormData();
    payload.append('name',form.elements.name?.value.trim()||'');
    payload.append('phone',normalizeVietnamPhone(phoneInput.value));
    payload.append('interest',form.elements.need?.value||'Nhận vị trí & thông tin lô đất');
    payload.append('source','Landing Page Bán Đất Diên Khánh');
    payload.append('page',window.location.href);
    await fetch(CONFIG.endpoint,{method:'POST',mode:'no-cors',body:payload});
    status.textContent='Đã gửi thông tin. Cảm ơn chị/anh!';
    form.reset();
  }catch{
    status.textContent='Chưa gửi được. Vui lòng gọi trực tiếp để được hỗ trợ.';
  }finally{
    btn.disabled=false;btn.textContent='Gửi yêu cầu'
  };
});
