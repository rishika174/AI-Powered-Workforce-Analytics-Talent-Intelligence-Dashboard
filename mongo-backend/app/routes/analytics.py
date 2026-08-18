from fastapi import APIRouter, HTTPException
from app.database.s3 import read_json

router = APIRouter(
    prefix="/analytics",
    tags=["Workforce Analytics"]
)


@router.get("/kpis")
async def get_kpis():

    employees = read_json("employees.json")
    departments = read_json("department_summary.json")

    total = len(employees)

    if total == 0:
        return {
            "totalEmployees": 0,
            "avgPerformance": 0,
            "totalDepartments": 0,
            "avgSalary": 0,
            "attritionRate": 0,
            "promotionRate": 0,
            "highRiskCount": 0,
            "hiringTrend": [],
            "departmentDistribution": [],
            "genderDistribution": [],
            "orgHealth": 0
        }

    # ---------------- Department Distribution ----------------

    department_distribution = []

    for dept in departments:
        department_distribution.append({
            "name": dept["department"],
            "count": dept["total_employees"],
            "color": "#3B82F6"
        })

    # ---------------- Gender Distribution ----------------

    male = sum(
        1 for e in employees
        if str(e.get("gender", "")).lower() == "male"
    )

    female = sum(
        1 for e in employees
        if str(e.get("gender", "")).lower() == "female"
    )

    others = total - male - female

    gender_distribution = [
        {
            "name": "Male",
            "count": male,
            "percentage": round((male / total) * 100, 1)
        },
        {
            "name": "Female",
            "count": female,
            "percentage": round((female / total) * 100, 1)
        }
    ]

    if others > 0:
        gender_distribution.append({
            "name": "Other",
            "count": others,
            "percentage": round((others / total) * 100, 1)
        })

    # ---------------- Average Salary ----------------

    avg_salary = round(
        sum(
            float(emp.get("basic_salary", 0) or 0)
            for emp in employees
        ) / total,
        2
    )

    # ---------------- Average Performance ----------------

    avg_performance = round(
        sum(
            float(emp.get("performance_rating", 0) or 0)
            for emp in employees
        ) / total,
        2
    )

    # ---------------- Attrition Rate ----------------

    departed = sum(
        1
        for emp in employees
        if str(emp.get("attrition_status", "")).lower() == "yes"
    )

    attrition_rate = round(
        (departed / total) * 100,
        2
    )

    # ---------------- Promotion Rate ----------------
    #
    # Dataset does not contain an actual promotion history field.
    # We use a reasonable eligibility rule:
    # 5+ years at company AND performance rating >= 4.

    promotion_eligible = sum(
        1
        for emp in employees
        if (
            float(emp.get("years_at_company", 0) or 0) >= 5
            and float(emp.get("performance_rating", 0) or 0) >= 4
        )
    )

    promotion_rate = round(
        (promotion_eligible / total) * 100,
        2
    )

    # ---------------- High Attrition Risk ----------------

    high_risk = sum(
        1
        for emp in employees
        if float(emp.get("attrition_risk_score", 0) or 0) >= 70
    )

    # ---------------- Organization Health ----------------
    #
    # Combines:
    # Performance       = 40%
    # Engagement        = 30%
    # Retention         = 30%

    performance_health = (
        avg_performance / 5
    ) * 100

    avg_engagement = (
        sum(
            float(emp.get("engagement_score", 0) or 0)
            for emp in employees
        ) / total
    )

    engagement_health = (
        avg_engagement / 100
    ) * 100

    retention_health = 100 - attrition_rate

    org_health = round(
        (
            performance_health * 0.40
            + engagement_health * 0.30
            + retention_health * 0.30
        ),
        1
    )

    # ---------------- Hiring Trend ----------------
    #
    # Keep the existing dashboard trend for now because the
    # current dataset does not contain a historical hiring/exit
    # event table.

    hiring_trend = [
        {"month": "Jan", "hired": 32, "departed": 8},
        {"month": "Feb", "hired": 28, "departed": 10},
        {"month": "Mar", "hired": 40, "departed": 11},
        {"month": "Apr", "hired": 37, "departed": 7},
        {"month": "May", "hired": 46, "departed": 12},
        {"month": "Jun", "hired": 35, "departed": 9},
        {"month": "Jul", "hired": 41, "departed": 13},
        {"month": "Aug", "hired": 39, "departed": 6}
    ]

    # ---------------- Return ----------------

    return {
        "totalEmployees": total,
        "avgPerformance": avg_performance,
        "totalDepartments": len(departments),
        "avgSalary": avg_salary,
        "attritionRate": attrition_rate,
        "promotionRate": promotion_rate,
        "highRiskCount": high_risk,
        "hiringTrend": hiring_trend,
        "departmentDistribution": department_distribution,
        "genderDistribution": gender_distribution,
        "orgHealth": org_health
    }
    
@router.get("/department-summary")
async def department_summary():
    """
    Return department analytics from S3 Gold Layer
    """

    try:
        return read_json("department_summary.json")

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.get("/leave-summary")
async def leave_summary():
    """
    Return leave analytics from S3 Gold Layer
    """

    try:
        return read_json("leave_summary.json")

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.get("/productivity-summary")
async def productivity_summary():
    """
    Return productivity analytics from S3 Gold Layer
    """

    try:
        return read_json("productivity_summary.json")

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.get("/workforce-overview")
async def workforce_overview():
    """
    Return combined workforce analytics
    """

    try:

        return {
            "department_summary": read_json("department_summary.json"),
            "leave_summary": read_json("leave_summary.json"),
            "productivity_summary": read_json("productivity_summary.json")
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )