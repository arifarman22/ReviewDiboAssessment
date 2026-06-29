import uuid
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from app.models.user import User
from app.models.product import Product
from app.models.review import Review
from app.core.security import hash_password
from loguru import logger

# Pre-defined seed data for consistent product names
SEED_USERS = [
    {"name": "Sarah Jenkins", "email": "sarah@example.com", "password": "password123"},
    {"name": "Alex Carter", "email": "alex@example.com", "password": "password123"},
    {"name": "Sophia Martinez", "email": "sophia@example.com", "password": "password123"},
    {"name": "David Kim", "email": "david@example.com", "password": "password123"},
    {"name": "Emily Cooper", "email": "emily@example.com", "password": "password123"},
]

SEED_PRODUCTS = [
    {
        "title": "AeroGlide Wireless Ergonomic Mouse",
        "description": "Experience unparalleled comfort and performance with the AeroGlide Wireless Mouse. Featuring an ergonomic vertical design that reduces wrist strain, an ultra-precise 26,000 DPI optical sensor, quiet-click tactile switches, and up to 120 hours of battery life.",
        "short_description": "Ergonomic vertical wireless mouse with 26k DPI sensor and silent clicks.",
        "image_url": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=600&fit=crop",
        "category": "Accessories",
        "price": 89.99,
    },
    {
        "title": "CyberClick K95 Mechanical Keyboard",
        "description": "A premium 75% layout mechanical keyboard designed for the ultimate typing experience. Engineered with hot-swappable linear yellow switches, double-shot PBT keycaps, sound-dampening gasket mount design, and customizable per-key RGB backlighting.",
        "short_description": "Gasket-mounted hot-swappable 75% mechanical keyboard with aluminum frame.",
        "image_url": "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=600&fit=crop",
        "category": "Keyboards",
        "price": 149.99,
    },
    {
        "title": "AuraSound ANC Gen-II Headphones",
        "description": "Immerse yourself in pure high-fidelity audio with AuraSound headphones. Featuring cutting-edge hybrid active noise cancellation, custom 40mm dynamic drivers, and a plush memory foam headband with 45-hour battery life.",
        "short_description": "Premium over-ear wireless headphones with hybrid active noise cancellation.",
        "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop",
        "category": "Audio",
        "price": 299.99,
    },
    {
        "title": "VoxMini Smart Speaker & Hub",
        "description": "Small size, monumental sound. The VoxMini is a compact smart speaker that doubles as an IoT smart home hub with custom acoustic drivers for rich bass and crisp highs.",
        "short_description": "Compact smart speaker with deep bass, high-fidelity sound, and IoT hub integration.",
        "image_url": "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=800&h=600&fit=crop",
        "category": "Smart Home",
        "price": 59.99,
    },
    {
        "title": "MagCharge 3-in-1 Power Stand",
        "description": "De-clutter your desk with the MagCharge Stand. Crafted from premium zinc alloy, it delivers fast wireless charging simultaneously to your smartphone, smartwatch, and earbuds.",
        "short_description": "MagSafe compatible 3-in-1 fast wireless charging dock made of zinc alloy.",
        "image_url": "https://images.unsplash.com/photo-1622445275576-721325763afe?w=800&h=600&fit=crop",
        "category": "Charging",
        "price": 79.99,
    },
    {
        "title": "Merino Wool Minimalist Desk Mat",
        "description": "Elevate your desk setup with a premium desk mat crafted from 100% renewable Merino wool felt. Provides a soft surface with smooth mouse tracking and anti-slip natural cork backing.",
        "short_description": "Eco-friendly felt wool desk mat with non-slip natural cork backing.",
        "image_url": "https://images.unsplash.com/photo-1616627988170-6c5a9eba8818?w=800&h=600&fit=crop",
        "category": "Accessories",
        "price": 49.99,
    },
    {
        "title": "UltraWide 34\" Curved Monitor",
        "description": "A stunning 34-inch ultrawide curved display with 3440x1440 resolution, 165Hz refresh rate, 1ms response time, and HDR600 support. Perfect for productivity and gaming.",
        "short_description": "34-inch UWQHD curved monitor with 165Hz and HDR600.",
        "image_url": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&h=600&fit=crop",
        "category": "Displays",
        "price": 599.99,
    },
    {
        "title": "StreamPro 4K Webcam",
        "description": "Professional 4K webcam with AI-powered auto-framing, dual stereo microphones, low-light correction, and magnetic privacy shutter. Ideal for streaming and video calls.",
        "short_description": "4K webcam with AI auto-frame and dual stereo microphones.",
        "image_url": "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=800&h=600&fit=crop",
        "category": "Cameras",
        "price": 129.99,
    },
    {
        "title": "NovaDock Thunderbolt 4 Hub",
        "description": "The ultimate docking solution with dual 4K display output, 96W power delivery, 10Gbps data transfer, SD card reader, and 5 USB ports in a compact aluminum chassis.",
        "short_description": "Thunderbolt 4 hub with dual 4K, 96W PD, and 10Gbps data.",
        "image_url": "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&h=600&fit=crop",
        "category": "Accessories",
        "price": 249.99,
    },
    {
        "title": "ErgoRise Standing Desk Converter",
        "description": "Transform any desk into a standing workstation. Gas-spring assisted height adjustment, holds dual monitors, built-in cable management, and anti-fatigue mat included.",
        "short_description": "Gas-spring standing desk converter with dual monitor support.",
        "image_url": "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=800&h=600&fit=crop",
        "category": "Furniture",
        "price": 349.99,
    },
]

SEED_REVIEWS = [
    # Product 0 (Mouse) - 5 reviews
    {"product_idx": 0, "user_idx": 0, "rating": 5, "comment": "The AeroGlide vertical mouse completely resolved my wrist pain! Highly recommended for developers.", "days_ago": 15},
    {"product_idx": 0, "user_idx": 1, "rating": 4, "comment": "Great mouse with excellent build quality. Silent click buttons are fantastic for quiet environments.", "days_ago": 12},
    {"product_idx": 0, "user_idx": 2, "rating": 5, "comment": "Amazing ergonomics. I was skeptical about vertical mice but now I will never go back.", "days_ago": 8},
    {"product_idx": 0, "user_idx": 3, "rating": 5, "comment": "Spectacular battery life! Three weeks on a single charge and still going strong.", "days_ago": 5},
    {"product_idx": 0, "user_idx": 4, "rating": 5, "comment": "Perfect size for medium to large hands. DPI adjustments are quick and sensor never skips.", "days_ago": 2},
    # Product 1 (Keyboard) - 4 reviews
    {"product_idx": 1, "user_idx": 0, "rating": 5, "comment": "The gasket mount typing feel is second to none. Sounds like gentle raindrops. Perfectly lubed out of the box.", "days_ago": 20},
    {"product_idx": 1, "user_idx": 1, "rating": 4, "comment": "Stunning keyboard with incredibly smooth linear switches. RGB looks gorgeous. Wish it had a volume dial.", "days_ago": 14},
    {"product_idx": 1, "user_idx": 2, "rating": 5, "comment": "Heavy, stable, beautiful CNC aluminum. Hot-swappable switches make customization easy.", "days_ago": 9},
    {"product_idx": 1, "user_idx": 3, "rating": 4, "comment": "Great typing experience with clean sound profile. Takes time to adjust from full-size layout.", "days_ago": 4},
    # Product 2 (Headphones) - 3 reviews
    {"product_idx": 2, "user_idx": 0, "rating": 5, "comment": "ANC is scary good! Blocks out everything. Audio quality is extremely clear and balanced.", "days_ago": 18},
    {"product_idx": 2, "user_idx": 1, "rating": 4, "comment": "Very comfortable ear cups with soft memory foam. Clear mic for calls. Charging is a bit slow.", "days_ago": 11},
    {"product_idx": 2, "user_idx": 2, "rating": 4, "comment": "Outstanding battery life - almost a full week. Spatial audio tracking works great for movies.", "days_ago": 6},
    # Product 3 (Speaker) - 4 reviews
    {"product_idx": 3, "user_idx": 0, "rating": 4, "comment": "Surprisingly punchy audio from such a small speaker. Privacy switch is a great touch.", "days_ago": 22},
    {"product_idx": 3, "user_idx": 1, "rating": 4, "comment": "IoT hub configuration was clean and responsive. Sound is crisp. Wish it had USB-C.", "days_ago": 16},
    {"product_idx": 3, "user_idx": 2, "rating": 4, "comment": "Aesthetically beautiful. Smart assistant response is quick and microphones pick up voice easily.", "days_ago": 10},
    {"product_idx": 3, "user_idx": 3, "rating": 5, "comment": "Multi-room audio sync is flawless. Bought two and they work perfectly together.", "days_ago": 4},
    # Product 4 (Charger) - 3 reviews
    {"product_idx": 4, "user_idx": 0, "rating": 4, "comment": "Magnet alignment is strong and secure. Charges all three devices at once. Gets slightly warm.", "days_ago": 19},
    {"product_idx": 4, "user_idx": 1, "rating": 3, "comment": "Sturdy and elegant but fast charging for Apple Watch is not supported. Disappointing at this price.", "days_ago": 13},
    {"product_idx": 4, "user_idx": 2, "rating": 4, "comment": "Does exactly what it should. Solid metal frame prevents tipping. Looks decent on desk.", "days_ago": 5},
    # Product 5 (Desk Mat) - 3 reviews
    {"product_idx": 5, "user_idx": 3, "rating": 5, "comment": "This wool felt mat looks incredibly premium! Very thick and soft with perfect non-slip cork back.", "days_ago": 17},
    {"product_idx": 5, "user_idx": 4, "rating": 4, "comment": "Beautiful texture, fits full size keyboard and mouse. Smooth enough for work, not for FPS gaming.", "days_ago": 9},
    {"product_idx": 5, "user_idx": 0, "rating": 5, "comment": "Very good desk mat. Keeps desk clean and wool is soft. Safe from scratches.", "days_ago": 3},
    # Product 6 (Monitor) - 2 reviews
    {"product_idx": 6, "user_idx": 1, "rating": 5, "comment": "The ultrawide experience is life-changing for productivity. Colors are vibrant and accurate.", "days_ago": 7},
    {"product_idx": 6, "user_idx": 2, "rating": 4, "comment": "Great monitor for the price. HDR could be better but the curve and resolution are fantastic.", "days_ago": 3},
    # Product 7 (Webcam) - 2 reviews
    {"product_idx": 7, "user_idx": 3, "rating": 5, "comment": "AI auto-framing is incredible. My video calls look professional now. Low-light correction works great.", "days_ago": 6},
    {"product_idx": 7, "user_idx": 4, "rating": 4, "comment": "Excellent 4K quality. Magnetic privacy shutter is convenient. Microphones are surprisingly good.", "days_ago": 2},
    # Product 8 (Dock) - 2 reviews
    {"product_idx": 8, "user_idx": 0, "rating": 4, "comment": "Perfect docking solution. Dual 4K works flawlessly. 96W PD charges my laptop at full speed.", "days_ago": 10},
    {"product_idx": 8, "user_idx": 1, "rating": 5, "comment": "This dock replaced all my dongles. Build quality is excellent and thermals are well managed.", "days_ago": 4},
    # Product 9 (Desk) - 2 reviews
    {"product_idx": 9, "user_idx": 2, "rating": 4, "comment": "Gas-spring adjustment is smooth and holds position well. Anti-fatigue mat is a nice bonus.", "days_ago": 8},
    {"product_idx": 9, "user_idx": 3, "rating": 5, "comment": "Transformed my work setup. Easy assembly, sturdy build, and cable management is thoughtful.", "days_ago": 1},
]


def seed_database(db: Session) -> None:
    """Seed the database with initial data if empty."""
    user_count = db.query(func.count(User.id)).scalar() or 0

    if user_count > 0:
        logger.info("Database already seeded, skipping...")
        return

    logger.info("Seeding database with initial data...")

    admin = User(
        id=str(uuid.uuid4()),
        name="Admin User",
        email="admin@reviewsphere.com",
        hashed_password=hash_password("admin123"),
        is_admin=True,
    )
    db.add(admin)

    users = []
    for u_data in SEED_USERS:
        user = User(
            id=str(uuid.uuid4()),
            name=u_data["name"],
            email=u_data["email"],
            hashed_password=hash_password(u_data["password"]),
        )
        db.add(user)
        users.append(user)

    db.flush()

    products = []
    for p_data in SEED_PRODUCTS:
        product = Product(
            id=str(uuid.uuid4()),
            title=p_data["title"],
            description=p_data["description"],
            short_description=p_data["short_description"],
            image_url=p_data["image_url"],
            category=p_data["category"],
            price=p_data["price"],
        )
        db.add(product)
        products.append(product)

    db.flush()

    now = datetime.now(timezone.utc)
    for r_data in SEED_REVIEWS:
        review = Review(
            id=str(uuid.uuid4()),
            product_id=products[r_data["product_idx"]].id,
            user_id=users[r_data["user_idx"]].id,
            rating=r_data["rating"],
            comment=r_data["comment"],
            created_at=now - timedelta(days=r_data["days_ago"]),
        )
        db.add(review)

    db.commit()
    logger.info(
        f"Database seeded: {len(users) + 1} users, {len(products)} products, {len(SEED_REVIEWS)} reviews"
    )
