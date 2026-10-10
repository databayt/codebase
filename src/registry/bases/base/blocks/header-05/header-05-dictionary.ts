import {
  type HeaderColumn,
  type HeaderDictionary,
} from "@/registry/bases/base/blocks/header-05/components/header-05"

/** A mega-menu column whose links all point at `href`. */
const col = (title: string, labels: string[], href = "#"): HeaderColumn => ({
  title,
  href,
  links: labels.map((label) => ({ label, href })),
})

export const dictionary: Record<"en" | "ar", HeaderDictionary> = {
  en: {
    brand: { name: "Acme", href: "#", homeLabel: "Acme home" },
    topBar: {
      brandsLabel: "Our brands",
      brands: [
        { label: "Acme Studio", href: "#" },
        { label: "Acme Outdoor", href: "#" },
      ],
      userLabel: "Account and help",
      links: [
        { label: "Find a store", href: "#" },
        {
          label: "Help",
          href: "#",
          menuLabel: "Help",
          menu: [
            { label: "Order status", href: "#" },
            { label: "Shipping & delivery", href: "#" },
            { label: "Returns", href: "#" },
            { label: "Size charts", href: "#" },
            { label: "Contact us", href: "#" },
          ],
        },
        { label: "Join us", href: "#" },
        { label: "Sign in", href: "#" },
      ],
      language: { label: "Language", name: "العربية", href: "/ar", lang: "ar" },
    },
    nav: {
      label: "Shop",
      items: [
        {
          label: "New",
          href: "#",
          columns: [
            col("Featured", ["New arrivals", "Best sellers", "Latest drops", "Gift guide"]),
            col("Trending", ["Running essentials", "Studio edit", "Outdoor layers"]),
            col("Shop by sport", ["Running", "Training", "Tennis", "Hiking"]),
          ],
        },
        {
          label: "Women",
          href: "#",
          columns: [
            col("Featured", ["New arrivals", "Best sellers", "Member exclusives"]),
            col("Shoes", ["All shoes", "Running", "Lifestyle", "Training", "Sandals"]),
            col("Clothing", ["All clothing", "Tops", "Leggings", "Jackets", "Shorts"]),
            col("Accessories", ["Bags", "Socks", "Hats", "Water bottles"]),
          ],
        },
        {
          label: "Men",
          href: "#",
          columns: [
            col("Featured", ["New arrivals", "Best sellers", "Member exclusives"]),
            col("Shoes", ["All shoes", "Running", "Lifestyle", "Training", "Slides"]),
            col("Clothing", ["All clothing", "T-shirts", "Hoodies", "Pants", "Shorts"]),
            col("Accessories", ["Bags", "Socks", "Hats", "Watches"]),
          ],
        },
        {
          label: "Kids",
          href: "#",
          columns: [
            col("Featured", ["New arrivals", "Back to school", "Best sellers"]),
            col("By age", ["Babies & toddlers", "Little kids", "Big kids"]),
            col("Shoes", ["All shoes", "Running", "School shoes"]),
          ],
        },
        { label: "Sale", href: "#" },
      ],
    },
    search: {
      label: "Search",
      placeholder: "Search",
      cancel: "Cancel",
      clear: "Clear search",
      popularLabel: "Popular search terms",
      popular: [
        "Running shoes",
        "Training",
        "Hoodies",
        "Backpacks",
        "Rain jackets",
        "Socks",
      ],
    },
    favorites: { label: "Favorites", href: "#" },
    bag: { label: "Bag items", href: "#", count: 2 },
    menu: { open: "Open menu", close: "Close menu", title: "Menu" },
  },
  ar: {
    brand: { name: "أكمي", href: "#", homeLabel: "الصفحة الرئيسية لأكمي" },
    topBar: {
      brandsLabel: "علاماتنا التجارية",
      brands: [
        { label: "أكمي ستوديو", href: "#" },
        { label: "أكمي للهواء الطلق", href: "#" },
      ],
      userLabel: "الحساب والمساعدة",
      links: [
        { label: "ابحث عن متجر", href: "#" },
        {
          label: "المساعدة",
          href: "#",
          menuLabel: "المساعدة",
          menu: [
            { label: "حالة الطلب", href: "#" },
            { label: "الشحن والتوصيل", href: "#" },
            { label: "الإرجاع", href: "#" },
            { label: "دليل المقاسات", href: "#" },
            { label: "تواصل معنا", href: "#" },
          ],
        },
        { label: "انضم إلينا", href: "#" },
        { label: "تسجيل الدخول", href: "#" },
      ],
      language: { label: "اللغة", name: "English", href: "/en", lang: "en" },
    },
    nav: {
      label: "تسوّق",
      items: [
        {
          label: "الجديد",
          href: "#",
          columns: [
            col("مختارات", ["وصل حديثًا", "الأكثر مبيعًا", "أحدث الإصدارات", "دليل الهدايا"]),
            col("رائج الآن", ["أساسيات الجري", "تشكيلة الاستوديو", "طبقات للهواء الطلق"]),
            col("حسب الرياضة", ["الجري", "التمارين", "التنس", "المشي الجبلي"]),
          ],
        },
        {
          label: "نساء",
          href: "#",
          columns: [
            col("مختارات", ["وصل حديثًا", "الأكثر مبيعًا", "حصريًا للأعضاء"]),
            col("الأحذية", ["كل الأحذية", "الجري", "الأحذية اليومية", "التمارين", "الصنادل"]),
            col("الملابس", ["كل الملابس", "القمصان", "السراويل الضيقة", "الجاكيتات", "الشورتات"]),
            col("الإكسسوارات", ["الحقائب", "الجوارب", "القبعات", "قوارير الماء"]),
          ],
        },
        {
          label: "رجال",
          href: "#",
          columns: [
            col("مختارات", ["وصل حديثًا", "الأكثر مبيعًا", "حصريًا للأعضاء"]),
            col("الأحذية", ["كل الأحذية", "الجري", "الأحذية اليومية", "التمارين", "الشباشب"]),
            col("الملابس", ["كل الملابس", "التيشيرتات", "الهوديز", "البناطيل", "الشورتات"]),
            col("الإكسسوارات", ["الحقائب", "الجوارب", "القبعات", "الساعات"]),
          ],
        },
        {
          label: "أطفال",
          href: "#",
          columns: [
            col("مختارات", ["وصل حديثًا", "العودة إلى المدرسة", "الأكثر مبيعًا"]),
            col("حسب العمر", ["الرضّع والصغار", "الأطفال الصغار", "الأطفال الكبار"]),
            col("الأحذية", ["كل الأحذية", "الجري", "أحذية المدرسة"]),
          ],
        },
        { label: "التخفيضات", href: "#" },
      ],
    },
    search: {
      label: "بحث",
      placeholder: "ابحث",
      cancel: "إلغاء",
      clear: "مسح البحث",
      popularLabel: "عمليات بحث شائعة",
      popular: [
        "أحذية الجري",
        "التمارين",
        "الهوديز",
        "حقائب الظهر",
        "جاكيتات المطر",
        "الجوارب",
      ],
    },
    favorites: { label: "المفضلة", href: "#" },
    bag: { label: "عناصر الحقيبة", href: "#", count: 2 },
    menu: { open: "فتح القائمة", close: "إغلاق القائمة", title: "القائمة" },
  },
}
