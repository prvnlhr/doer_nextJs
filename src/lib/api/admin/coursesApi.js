import { revalidateTagHandler } from "@/app/revalidate";
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

export async function fetchCourses() {
  try {
    let response = await fetch(`${BASE_URL}/api/admin/courses`, {
      next: { tags: ["fetchAdminCourses"] },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch courses");
    }
    return response.json();
  } catch (error) {
    throw new Error(`Fetch courses error: ${error}`);
  }
}
export async function fetchCourseById(courseId) {
  try {
    let response = await fetch(`${BASE_URL}/api/admin/courses/${courseId}`, {
      next: { tags: ["fetchCourseById"] },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch course by id");
    }
    await revalidateTagHandler("fetchAdminCourses");
    return response.json();
  } catch (error) {
    throw new Error(`Fetch courses error: ${error}`);
  }
}

export async function createCourse(formData) {
  try {
    const response = await fetch(`${BASE_URL}/api/admin/courses`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to create course");
    }

    await revalidateTagHandler("fetchClientCourses");
    await revalidateTagHandler("fetchAdminCourses");

    return response.json();
  } catch (error) {
    throw new Error(`Create course error: ${error}`);
  }
}

export async function updateCourse(formData, courseId) {
  try {
    let response = await fetch(`${BASE_URL}/api/admin/courses/${courseId}`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      console.log(response);
      throw new Error("Failed to fetch course by id");
    }
    await revalidateTagHandler("fetchAdminCourses");
    await revalidateTagHandler("fetchClientCourses");

    return response.json();
  } catch (error) {
    throw new Error(`Fetch courses error: ${error}`);
  }
}

export async function deleteCourse(courseId) {
  try {
    const response = await fetch(`${BASE_URL}/api/admin/courses/${courseId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      console.log(response);
      throw new Error(
        " HTTP !  Error :: Failed to delete course and its content"
      );
    }
    await revalidateTagHandler("fetchAdminCourses");
    await revalidateTagHandler("fetchClientCourses");
    return response.json();
  } catch (error) {
    throw new Error(`Error in deleting the course ${error}`);
  }
}
