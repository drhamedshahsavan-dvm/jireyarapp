/* ===== Catalogue =====
   To add a product, add an entry to PRODUCTS:
   {cat:'pet-food', name:'نام محصول', desc:'توضیح کوتاه', price:1250000, img:'product-example.webp'}
   cat is one of the ids in CATS. Price is in toman; leave it out to show «استعلام قیمت». */
var CATS = [
  {id:'pet-food',    title:'غذا و تشویقی پت',     img:'image-s-petfood.webp',  desc:'غذای خشک و تر، تشویقی و مکمل‌های سگ و گربه، برای هر سن و شرایط.', tags:['غذای خشک','غذای تر','تشویقی','مکمل']},
  {id:'pet-gear',    title:'لوازم پت',              img:'image-s-petgear.webp',  desc:'ظرف غذا و آب، قلاده، اسباب‌بازی و لوازم نگهداری روزانه.', tags:['ظرف غذا و آب','قلاده','اسباب‌بازی','بهداشتی']},
  {id:'supplements', title:'مکمل و افزودنی دام',  img:'image-s-livestock.webp', desc:'مکمل‌های معدنی و ویتامینی، بافرها و افزودنی‌های خوراک دام و طیور.', tags:['مکمل معدنی و ویتامینی','بافر','افزودنی خوراک']},
  {id:'farm',        title:'تجهیزات دامداری',      img:'image-s-farm.webp',     desc:'ابزار و تجهیزات کاربردی برای جایگاه، تغذیه و نگهداری دام.', tags:['آبشخور و آخور','ترازو','ابزار تغذیه']}
];
var PRODUCTS = [];

(function(){
  var fa = function(n){ return Number(n).toLocaleString('fa-IR'); };
  var esc = function(t){ return String(t).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); };
  var tabs = document.getElementById('tabs'), box = document.getElementById('cats');
  tabs.innerHTML = CATS.map(function(c){ return '<a href="#'+c.id+'">'+esc(c.title)+'</a>'; }).join('');
  box.innerHTML = CATS.map(function(c){
    var items = PRODUCTS.filter(function(p){ return p.cat === c.id; });
    var grid = items.length ? '<div class="grid">' + items.map(function(p){
      return '<article class="card"><div class="im"><img src="'+esc(p.img||c.img)+'" alt="'+esc(p.name)+'" loading="lazy"></div><div class="bd"><h3>'+esc(p.name)+'</h3>'+(p.desc?'<p>'+esc(p.desc)+'</p>':'')+
        '<div class="row"><span class="price">'+(p.price ? fa(p.price)+' <small>تومان</small>' : '<small>استعلام قیمت</small>')+'</span><a class="btn btn-dark" href="https://t.me/jireyar" rel="noopener">سفارش</a></div></div></article>';
    }).join('') + '</div>'
      : '<div class="empty"><div><b>محصولات این دسته به‌زودی</b><p>برای اطلاع از موجودی و سفارش، در تلگرام جیره‌یار پیام بدهید.</p></div><a class="btn btn-dark" href="https://t.me/jireyar" rel="noopener">پیام در تلگرام</a></div>';
    return '<section class="cat" id="'+c.id+'"><div class="in"><div class="cat-head"><div><h2>'+esc(c.title)+'</h2><p>'+esc(c.desc)+'</p><ul>'+c.tags.map(function(t){ return '<li>'+esc(t)+'</li>'; }).join('')+'</ul></div><div class="ph"><img src="'+c.img+'" alt="'+esc(c.title)+'" loading="lazy"></div></div>'+grid+'</div></section>';
  }).join('');
  var links = [].slice.call(tabs.querySelectorAll('a')), secs = CATS.map(function(c){ return document.getElementById(c.id); });
  function mark(){ var cur = 0; secs.forEach(function(s,i){ if (s.getBoundingClientRect().top < 160) cur = i; }); links.forEach(function(a,i){ a.classList.toggle('on', i === cur && scrollY > 300); }); }
  addEventListener('scroll', mark, {passive:true}); mark();
})();
