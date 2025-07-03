<script lang="ts">
	export let data: { rooms: any[], users: any[], search: string };
	let { rooms, users, search } = data;
</script>

<div class="p-3">
	<h4 class="h4 fw-bold">รายงานห้องของลูกค้า</h4>
	<form method="GET" class="d-flex mb-3">
		<input
			type="text"
			name="search"
			placeholder="ชื่อห้อง, ชื่อ-นามสกุล"
			class="form-control w-72 me-2"
			value={search}
		/>
		<button class="btn btn-primary bg-primary me-2" type="submit">ค้นหา</button>
		<a href="" class="btn btn-outline">ล้าง</a>
	</form>

	<div class="table-responsive">
		<table class="table table-hover">
			<thead>
				<tr class="bg-secondary-subtle">
					<th class="text-center">ลำดับ</th>
					<th>ชื่อห้อง</th>
					<th>รหัสลูกค้า</th>
					<th>ชื่อ-นามสกุล</th>
					<th class="text-end">โควตาที่ใช้</th>
					<th class="text-end">จำนวนเงินขั้นต่ำที่ได้รับ</th>
				</tr>
			</thead>
			<tbody class="text-center">
				{#if rooms.length === 0}
					<tr><td colspan="7">ไม่พบข้อมูล</td></tr>
				{:else}
					{#each rooms as item, index}
						<tr class="text-start">
							<td class="text-center">{index + 1}</td>
							<td title={item.room_name}>{item.room_name}</td>
							<td>{item.user_id}</td>
							<td title={users?.find(e=>e.id === item.user_id)?.name_th || "-"}>
								{users?.find(e=>e.id === item.user_id)?.name_th || "-"}
							</td>
							<td class="text-end">{item.quota_used}</td>
							<td class="text-end">{item.min_receive.toFixed(2)}</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
</div>
