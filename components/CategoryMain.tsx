

export default function CategoryMain() {
  return (
     <div className="category-section">
        {/* TODO: Add SalePlanner component here */}
        <div className="d-flex align-items-center justify-content-between">
            <h2>Browse By Category</h2>
            <div className="d-flex">
                <div className="arrow" id="prevBtn">‹</div>
                <div className="arrow" id="nextBtn">›</div>
            </div>
        </div>

        <div className="categories-container">
            <div className="categories" id="categoryList">
                <div className="category border-light" data-category="phones">
                    <img src="https://img.icons8.com/ios/50/000000/iphone.png" /><span>Phones</span>
                </div>
                <div className="category border-light" data-category="smartwatch">
                    <img
                        src="https://img.icons8.com/?size=100&id=22193&format=png&color=000000" /><span>SmartWatches</span>
                </div>
                <div className="category border-light" data-category="cameras">
                    <img src="https://img.icons8.com/ios/50/000000/camera.png" /><span>Cameras</span>
                </div>
                <div className="category border-light" data-category="headphones">
                    <img src="https://img.icons8.com/ios/50/000000/headphones.png" /><span>Headphones</span>
                </div>
                <div className="category border-light" data-category="computers">
                    <img src="https://img.icons8.com/ios/50/000000/imac.png" /><span>Computers</span>
                </div>
                <div className="category border-light" data-category="gaming">
                    <img src="https://img.icons8.com/ios/50/000000/controller.png" /><span>Gaming</span>
                </div>
            </div>
        </div>
        {/* Toast container for notifications */}
        <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 9999 }}></div>
    </div>
  )
}